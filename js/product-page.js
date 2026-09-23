document.addEventListener("DOMContentLoaded",()=>{
  const visual=document.querySelector(".product_visual"),thumbs=[...document.querySelectorAll("[data-gallery-index]")];
  const modal=document.querySelector("#order-modal"),openButton=document.querySelector(".js_order"),closeButton=modal?.querySelector(".modal_close");
  const form=document.querySelector("#order-form"),status=document.querySelector("#form-status"),submit=form?.querySelector("[type=submit]");
  const steps=[...form.querySelectorAll(".form_step")],retryButton=form.querySelector(".delivery_retry");
  const deliveryDataUrl="../assets/delivery-data.json";
  const sheetsUrl="https://script.google.com/macros/s/AKfycbw5JZtoExsSxBC_8jqDJ5HTJSCXfGOZesjk1UdWFK_OnGwHmeU7qeCBOV4JZe1GubMkBA/exec";
  const state={step:1,config:null,configPromise:null,configRequest:0,officeRequest:0,retry:"",createdAt:"",identityFailed:false};
  const activeRequests=new Set();
  const officeCache=new Map();
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  const selectWidgets=new Map();
  let autoplayTimer=0,gestureX=null,transitionId=0,openSelect=null;
  if(visual)visual.style.touchAction="pan-y";
  thumbs.forEach(button=>{const image=button.querySelector("img");if(image)image.style.transform="scale("+(Number(button.dataset.galleryZoom)||1)+")"});
  const initialThumb=thumbs.find(item=>item.getAttribute("aria-pressed")==="true");
  if(visual&&initialThumb)visual.style.backgroundSize=gallerySize(initialThumb);

  function modalOpen(){return Boolean(modal?.open)}
  function field(name){return form.elements[name]}
  function setStatus(text,error=false){if(!status)return;status.textContent=text;status.hidden=!error;status.style.color=error?"#9d214d":"";status.style.background=error?"#fff0f5":""}
  function localPhoneDigits(value){const raw=String(value),all=raw.replace(/\D/g,"");let digits=all;if((raw.trim().startsWith("+998")||digits.length>9)&&digits.startsWith("998"))digits=digits.slice(3);if(digits.length>9&&digits.startsWith("0"))digits=digits.slice(1);return digits.slice(0,9)}
  function formatLocalPhone(value){const digits=localPhoneDigits(value);return [digits.slice(0,2),digits.slice(2,5),digits.slice(5,7),digits.slice(7,9)].filter(Boolean).join(" ")}
  function normalizedPhone(){const digits=localPhoneDigits(field("phone").value);return digits?"+998 "+formatLocalPhone(digits):""}
  function phoneReady(){return localPhoneDigits(field("phone").value).length===9}
  function identityReady(){return field("full_name").value.trim().length>=2&&phoneReady()}
  function orderReady(){return identityReady()&&["region","district","post_type","post_office"].every(name=>field(name).value)}
  function tashkentTimestamp(){const parts=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Tashkent",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(new Date()).filter(part=>part.type!=="literal").map(part=>[part.type,part.value]));return parts.day+"."+parts.month+"."+parts.year+" "+parts.hour+":"+parts.minute+":"+parts.second}
  function sheetPayload(complete=false){if(!state.createdAt)state.createdAt=tashkentTimestamp();return{sheetName:"Lead",Ism:field("full_name").value.trim(),"Telefon raqam":normalizedPhone(),"Royhatdan o'tgan vaqti":state.createdAt,Viloyat:complete?field("region").value:"","Shahar/tuman":complete?field("district").value:"",Pochta:complete?field("post_type").value:"",Fillial:complete?field("post_office").value:"","Qoshimcha manzil yoki moljal":complete?field("address_note").value.trim():"",Atir:document.querySelector(".product_title")?.textContent.trim()||document.body.dataset.productCode||""}}
  async function sendToSheets(complete=false){try{const response=await fetch(sheetsUrl,{method:"POST",mode:"cors",credentials:"omit",keepalive:true,headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:new URLSearchParams(sheetPayload(complete))}),result=await response.json().catch(()=>({}));if(!response.ok||result.ok!==true)throw new Error(result.message||"Sheets maʼlumotni qabul qilmadi.");if(!complete){state.identityFailed=false;if(state.retry==="identity"){setRetry();setStatus("")}}return true}catch(error){console.warn("Sheets soʻrovini yuborib boʻlmadi.",error);if(!complete&&modalOpen()&&state.step===2&&!form.hidden){state.identityFailed=true;setRetry("identity");setStatus("Ism va telefon saqlanmadi. Qayta yuborishni bosing.",true)}return false}}
  function updateButton(){const ready=state.step===1?identityReady():orderReady();submit.disabled=!ready;submit.textContent=state.step===1?"Davom etish →":"Buyurtmani tasdiqlash";steps.forEach(step=>step.disabled=Number(step.dataset.step)!==state.step);form.setAttribute("aria-busy","false")}
  function setRetry(kind=""){state.retry=kind;retryButton.hidden=!kind||state.step!==2;retryButton.disabled=false;retryButton.textContent=kind==="identity"?"Qayta yuborish":"Qayta yuklash"}
  function showStep(number,focus=true){closeSelect();state.step=number;steps.forEach(step=>step.hidden=Number(step.dataset.step)!==number);setRetry(state.retry);updateButton();setStatus("");modal.querySelector(".modal_inner").scrollTop=0;if(focus)steps[number-1].querySelector(".step_title").focus();if(number===2)loadConfig()}
  function paymentPanel(){let panel=modal.querySelector(".payment_panel");if(panel)return panel;panel=document.createElement("section");panel.className="payment_panel";panel.hidden=true;panel.tabIndex=-1;panel.setAttribute("aria-live","polite");panel.innerHTML='<p class="payment_success">✓ Buyurtmangiz qabul qilindi. Tez orada operatorimiz siz bilan bogʻlanadi.</p><div class="payment_summary"><span>Tanlangan mahsulot</span><strong class="payment_product"></strong><b class="payment_amount"></b><small class="payment_description"></small></div><a class="payment_action" href="#"><span>Telegram orqali bogʻlanish</span><span class="modal_help_icon" aria-hidden="true"><svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M21.7 3.2 18.5 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6 12.8l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.1 2.6c.9-.3 1.8.2 1.6.6Z"/></svg></span></a><a class="payment_channel" href="https://t.me/+vE3ujSZuXVU3YmFi" target="_blank" rel="noopener noreferrer">Bizni Telegram kanalida kuzatib boring</a>';form.after(panel);return panel}
  function showPayment(){const panel=paymentPanel(),productName=document.querySelector(".product_title")?.textContent.trim()||"Tanlangan mahsulot",productPrice=document.querySelector(".current_price")?.textContent.trim()||"";panel.querySelector(".payment_product").textContent=productName;panel.querySelector(".payment_amount").textContent=productPrice;const description=panel.querySelector(".payment_description");description.textContent="";description.hidden=true;const contact=panel.querySelector(".payment_action");contact.hidden=true;contact.style.display="none";form.hidden=true;panel.hidden=false;modal.classList.add("has_payment");panel.focus()}
  function closeSelect(returnFocus=false){if(!openSelect)return;const ui=selectWidgets.get(openSelect);if(ui){ui.widget.classList.remove("is_open");ui.widget.style.removeProperty("--select-chevron-rotate");ui.button.setAttribute("aria-expanded","false");ui.menu.hidden=true;if(returnFocus)ui.button.focus()}openSelect=null}
  function focusSelectOption(ui,index){const choices=[...ui.menu.querySelectorAll(".select_option:not([hidden]):not(:disabled)")];if(!choices.length)return;choices[(index+choices.length)%choices.length].focus()}
  function openCustomSelect(select,direction=1){const ui=selectWidgets.get(select);if(!ui||select.disabled)return;if(openSelect&&openSelect!==select)closeSelect();openSelect=select;ui.widget.classList.add("is_open");ui.widget.style.setProperty("--select-chevron-rotate","180deg");ui.button.setAttribute("aria-expanded","true");ui.menu.hidden=false;const choices=[...ui.menu.querySelectorAll(".select_option:not([hidden]):not(:disabled)")],selected=Math.max(0,choices.findIndex(option=>option.getAttribute("aria-selected")==="true")),index=select.value?selected:direction<0?choices.length-1:0;requestAnimationFrame(()=>focusSelectOption(ui,index))}
  function chooseSelectOption(select,value){if(select.value!==value){select.value=value;select.dispatchEvent(new Event("change",{bubbles:true}))}closeSelect(true)}
  function syncSelect(select){const ui=selectWidgets.get(select);if(!ui)return;const selected=select.selectedOptions[0]||select.options[0],placeholder=!select.value;ui.value.textContent=selected?.textContent||"Tanlang";ui.value.classList.toggle("is_placeholder",placeholder);ui.button.disabled=select.disabled;ui.widget.classList.toggle("is_disabled",select.disabled);ui.menu.replaceChildren();[...select.options].filter(option=>!option.disabled).forEach((option,index)=>{const choice=document.createElement("button"),isPlaceholder=!option.value;choice.type="button";choice.className="select_option";choice.id=ui.menu.id+"-option-"+index;choice.setAttribute("role","option");choice.setAttribute("aria-selected",String(option.value===select.value));choice.dataset.value=option.value;choice.textContent=option.textContent;choice.hidden=isPlaceholder;choice.disabled=isPlaceholder;if(!isPlaceholder){choice.addEventListener("click",()=>chooseSelectOption(select,option.value));choice.addEventListener("keydown",event=>{const choices=[...ui.menu.querySelectorAll(".select_option:not([hidden]):not(:disabled)")],current=choices.indexOf(choice);if(event.key==="ArrowDown"||event.key==="ArrowUp"){event.preventDefault();focusSelectOption(ui,current+(event.key==="ArrowDown"?1:-1))}else if(event.key==="Home"||event.key==="End"){event.preventDefault();focusSelectOption(ui,event.key==="Home"?0:choices.length-1)}else if(event.key==="Escape"){event.preventDefault();event.stopPropagation();closeSelect(true)}else if(event.key==="Enter"||event.key===" "){event.preventDefault();chooseSelectOption(select,option.value)}else if(event.key==="Tab")closeSelect()})}ui.menu.append(choice)});if(select.disabled&&openSelect===select)closeSelect()}
  function enhanceSelect(select){const label=form.querySelector('label[for="'+select.id+'"]'),base=select.id||select.name.replaceAll("_","-");if(!label)return;label.id=label.id||base+"-label";select.classList.add("native_select");select.tabIndex=-1;select.setAttribute("aria-hidden","true");const widget=document.createElement("div");widget.className="select_widget";const button=document.createElement("button"),value=document.createElement("span"),icon=document.createElementNS("http://www.w3.org/2000/svg","svg"),path=document.createElementNS("http://www.w3.org/2000/svg","path"),menu=document.createElement("div");button.type="button";button.className="select_trigger";button.id=base+"-trigger";button.setAttribute("aria-haspopup","listbox");button.setAttribute("aria-expanded","false");value.className="select_value";value.id=base+"-value";icon.classList.add("select_chevron");icon.setAttribute("viewBox","0 0 24 24");icon.setAttribute("aria-hidden","true");path.setAttribute("d","m7 10 5 5 5-5");icon.append(path);button.append(value,icon);menu.className="select_menu";menu.id=base+"-listbox";menu.setAttribute("role","listbox");menu.setAttribute("aria-labelledby",label.id);menu.hidden=true;button.setAttribute("aria-controls",menu.id);button.setAttribute("aria-labelledby",label.id+" "+value.id);label.htmlFor=button.id;widget.append(button,menu);select.after(widget);const ui={select,field:select.closest(".field"),widget,button,value,menu};selectWidgets.set(select,ui);button.addEventListener("click",()=>openSelect===select?closeSelect():openCustomSelect(select));button.addEventListener("keydown",event=>{if(event.key==="ArrowDown"||event.key==="ArrowUp"){event.preventDefault();openCustomSelect(select,event.key==="ArrowUp"?-1:1)}else if(event.key==="Escape"&&openSelect===select){event.preventDefault();event.stopPropagation();closeSelect()}});select.addEventListener("change",()=>syncSelect(select));syncSelect(select)}
  function gallerySize(button){return "auto "+((Number(button?.dataset.galleryZoom)||1)*100)+"%"}
  function revealThumb(button,animate=true){const strip=button?.parentElement;if(!strip||strip.scrollWidth<=strip.clientWidth)return;const stripBox=strip.getBoundingClientRect(),buttonBox=button.getBoundingClientRect(),target=strip.scrollLeft+buttonBox.left-stripBox.left-(strip.clientWidth-buttonBox.width)/2,max=strip.scrollWidth-strip.clientWidth;strip.scrollTo({left:Math.max(0,Math.min(max,target)),behavior:animate&&!reducedMotion.matches?"smooth":"auto"})}
  function stopAutoplay(){clearInterval(autoplayTimer);autoplayTimer=0}
  function paintGallery(button,direction=1,animate=true){const current=thumbs.find(item=>item.getAttribute("aria-pressed")==="true");if(!button||button===current)return;const nextImage=getComputedStyle(button).getPropertyValue("--gallery-image"),nextSize=gallerySize(button),id=++transitionId;visual.setAttribute("aria-label",button.dataset.galleryAlt);thumbs.forEach(item=>item.setAttribute("aria-pressed",String(item===button)));revealThumb(button,animate);if(!animate||reducedMotion.matches){visual.style.backgroundImage=nextImage;visual.style.backgroundSize=nextSize;return}visual.querySelectorAll("[data-gallery-slide]").forEach(node=>node.remove());visual.style.position="relative";visual.style.overflow="hidden";const slide=document.createElement("span");slide.dataset.gallerySlide="";slide.setAttribute("aria-hidden","true");Object.assign(slide.style,{position:"absolute",inset:"0",zIndex:"1",pointerEvents:"none",backgroundImage:nextImage,backgroundPosition:"center",backgroundRepeat:"no-repeat",backgroundSize:nextSize,willChange:"transform"});visual.append(slide);const animation=slide.animate([{transform:"translateX("+(direction*100)+"%)"},{transform:"translateX(0)"}],{duration:460,easing:"cubic-bezier(.22,1,.36,1)"});animation.finished.then(()=>{if(id===transitionId){visual.style.backgroundImage=nextImage;visual.style.backgroundSize=nextSize}slide.remove()}).catch(()=>slide.remove())}
  function moveGallery(step,manual=false){if(thumbs.length<2)return;const current=Math.max(0,thumbs.findIndex(item=>item.getAttribute("aria-pressed")==="true")),next=(current+step+thumbs.length)%thumbs.length;paintGallery(thumbs[next],step>=0?1:-1,true);if(manual)startAutoplay()}
  function startAutoplay(){stopAutoplay();if(thumbs.length<2||reducedMotion.matches||document.hidden||modal?.open)return;autoplayTimer=setInterval(()=>moveGallery(1),3800)}
  async function fetchDeliveryData(){if(!modalOpen())throw new DOMException("Modal yopilgan.","AbortError");const controller=new AbortController();activeRequests.add(controller);try{const response=await fetch(deliveryDataUrl,{signal:controller.signal,credentials:"same-origin"});if(!response.ok)throw new Error("Yetkazib berish manzillarini yuklab boʻlmadi.");const data=await response.json();if(!data||!Array.isArray(data.regions)||!data.districts||!Array.isArray(data.branches))throw new Error("Yetkazib berish manzillari notoʻgʻri.");return data}finally{activeRequests.delete(controller)}}
  function options(select,items,placeholder){select.innerHTML='<option value="">'+placeholder+'</option>'+items.map(item=>'<option value="'+escapeHtml(item)+'">'+escapeHtml(item)+'</option>').join("");select.disabled=false;syncSelect(select)}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
  async function loadConfig(){
    if(state.config||!modalOpen()||state.step!==2)return;
    if(state.configPromise)return state.configPromise;
    const request=++state.configRequest;
    if(!state.identityFailed){setRetry();setStatus("Yetkazib berish manzillari yuklanmoqda…")}
    const pending=(async()=>{
      try{
        const config=await fetchDeliveryData();
        if(request!==state.configRequest)return;
        state.config=config;
        options(field("region"),config.regions,"Viloyatni tanlang");
        options(field("post_type"),config.post_types,"Pochta xizmatini tanlang");
        if(state.step===2&&!state.identityFailed)setStatus("Yetkazib berish joyini tanlang.");
      }catch(error){
        if(error.name!=="AbortError"&&request===state.configRequest&&modalOpen()&&!state.identityFailed){setRetry("config");if(state.step===2)setStatus(error.message,true)}
      }finally{if(request===state.configRequest)state.configPromise=null}
    })();
    state.configPromise=pending;return pending;
  }
  function resetOffices(text="Tuman va pochtani tanlang"){field("post_office").innerHTML='<option value="">'+text+'</option>';field("post_office").disabled=true;syncSelect(field("post_office"))}
  function distanceKm(a,b){const toRadians=value=>value*Math.PI/180,[lat1,lon1,lat2,lon2]=[a.lat,a.lon,b.lat,b.lon].map(toRadians),h=Math.sin((lat2-lat1)/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin((lon2-lon1)/2)**2;return 6371*2*Math.asin(Math.sqrt(h))}
  function officesFor(region,district,type){const branches=state.config?.branches||[],available=branches.filter(branch=>branch.region===region&&branch.carrier===type),own=available.filter(branch=>branch.district===district),rest=available.filter(branch=>branch.district!==district),points=branches.filter(branch=>branch.region===region&&branch.district===district&&Number.isFinite(branch.lat)&&Number.isFinite(branch.lon));if(!points.length)return own.concat(rest);const point={lat:points.reduce((sum,item)=>sum+item.lat,0)/points.length,lon:points.reduce((sum,item)=>sum+item.lon,0)/points.length};rest.sort((a,b)=>distanceKm(point,a)-distanceKm(point,b));return own.concat(rest.slice(0,8),rest.slice(8).sort((a,b)=>a.district.localeCompare(b.district,"uz")||a.label.localeCompare(b.label,"uz")))}
  function loadOffices(force=false){
    if(!modalOpen()||state.step!==2)return;
    const request=++state.officeRequest,region=field("region").value,district=field("district").value,type=field("post_type").value;
    resetOffices();if(!state.identityFailed)setRetry();updateButton();
    if(!region||!district||!type)return;
    const query=String(new URLSearchParams({region,district,type}));
    if(force)officeCache.delete(query);
    let offices=officeCache.get(query);
    if(!offices){offices=officesFor(region,district,type);officeCache.set(query,offices)}
    if(request!==state.officeRequest)return;
    field("post_office").innerHTML='<option value="">Filialni tanlang</option>'+offices.map(office=>'<option value="'+escapeHtml(office.id)+'">'+escapeHtml(office.label)+'</option>').join("");
    field("post_office").disabled=!offices.length;syncSelect(field("post_office"));
    if(state.step===2&&!state.identityFailed)setStatus(offices.length?"Sizga qulay pochta filialini tanlang.":"Bu hududda tanlangan pochta filiali topilmadi.",!offices.length);
    updateButton();
  }
  function stopModalRequests(){state.configRequest++;state.officeRequest++;state.configPromise=null;activeRequests.forEach(controller=>controller.abort());activeRequests.clear();updateButton();startAutoplay()}

  form?.querySelectorAll("select").forEach(enhanceSelect);
  document.addEventListener("pointerdown",event=>{if(openSelect&&!selectWidgets.get(openSelect)?.widget.contains(event.target))closeSelect()});
  thumbs.forEach(button=>button.addEventListener("click",()=>{const current=thumbs.findIndex(item=>item.getAttribute("aria-pressed")==="true"),next=thumbs.indexOf(button);paintGallery(button,next>=current?1:-1,true);startAutoplay()}));
  visual?.addEventListener("pointerdown",event=>{if(event.pointerType==="touch"||event.pointerType==="pen"){gestureX=event.clientX;stopAutoplay()}});
  visual?.addEventListener("pointerup",event=>{if(gestureX===null)return;const distance=event.clientX-gestureX;gestureX=null;if(Math.abs(distance)>=35)moveGallery(distance<0?1:-1,true);else startAutoplay()});
  visual?.addEventListener("pointercancel",()=>{gestureX=null;startAutoplay()});
  visual?.addEventListener("mouseenter",stopAutoplay);
  visual?.addEventListener("mouseleave",startAutoplay);
  document.addEventListener("visibilitychange",startAutoplay);
  reducedMotion.addEventListener?.("change",startAutoplay);
  openButton?.addEventListener("click",()=>{stopAutoplay();modal.showModal();if(state.step===2&&!form.hidden){loadConfig();if(field("region").value&&field("district").value&&field("post_type").value&&!field("post_office").value)loadOffices()}});
  closeButton?.addEventListener("click",()=>modal.close());
  modal?.addEventListener("click",event=>{if(event.target===modal)modal.close()});
  modal?.addEventListener("close",()=>{closeSelect();stopModalRequests()});
  field("phone")?.addEventListener("beforeinput",event=>{if(event.inputType==="insertText"&&event.data?.length===1&&/\D/.test(event.data))event.preventDefault()});
  form?.addEventListener("input",event=>{if(!modalOpen())return;if(event.target.name==="phone")event.target.value=formatLocalPhone(event.target.value);event.target.setCustomValidity?.("");updateButton();if(state.step===1)setStatus("")});
  field("region")?.addEventListener("change",()=>{if(!modalOpen()||state.step!==2)return;const districts=state.config?.districts?.[field("region").value]||[];options(field("district"),districts,"Shahar yoki tumanni tanlang");loadOffices()});
  field("district")?.addEventListener("change",()=>loadOffices());
  field("post_type")?.addEventListener("change",()=>loadOffices());
  field("post_office")?.addEventListener("change",()=>{if(!modalOpen()||state.step!==2)return;updateButton();if(!state.identityFailed)setStatus("Tayyor. Buyurtmani tasdiqlang.")});
  retryButton.addEventListener("click",()=>{if(state.step!==2)return;if(state.retry==="identity"){state.identityFailed=false;setRetry();setStatus("");void sendToSheets(false)}else if(state.retry==="config")loadConfig();else if(state.retry==="offices")loadOffices(true)});
  form?.addEventListener("submit",event=>{
    event.preventDefault();if(!modalOpen()||form.hidden)return;
    field("full_name").setCustomValidity(field("full_name").value.trim().length>=2?"":"Ism va familiyangizni kiriting.");
    field("phone").setCustomValidity(phoneReady()?"":"Oʻzbekiston telefon raqamini toʻliq kiriting.");
    if(!identityReady()){if(state.step!==1)showStep(1);form.reportValidity();return}
    if(state.step===1){if(!form.reportValidity())return;void sendToSheets(false);showStep(2);return}
    if(!orderReady()){const missing=["region","district","post_type","post_office"].map(field).find(select=>!select.value);selectWidgets.get(missing)?.button.focus();setStatus("Yetkazib berish joyini toʻliq tanlang.",true);return}
    if(!form.reportValidity())return;
    void sendToSheets(true);showPayment();
  });
  showStep(1,false);
  startAutoplay();
});
