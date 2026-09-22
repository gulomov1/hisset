document.addEventListener("DOMContentLoaded",()=>{
  const visual=document.querySelector(".product_visual"),thumbs=[...document.querySelectorAll("[data-gallery-index]")];
  const modal=document.querySelector("#order-modal"),openButton=document.querySelector(".js_order"),closeButton=modal?.querySelector(".modal_close");
  const form=document.querySelector("#order-form"),status=document.querySelector("#form-status"),submit=form?.querySelector("[type=submit]");
  const steps=[...form.querySelectorAll(".form_step")],backButton=form.querySelector(".step_back"),retryButton=form.querySelector(".delivery_retry");
  const body=document.body,localPreview=/^(localhost|127\.0\.0\.1)$/.test(location.hostname),apiBase=localPreview?(location.port==="5177"?"":location.protocol+"//"+location.hostname+":5177"):body.dataset.apiBase,productCode=body.dataset.productCode;
  const state={token:createToken(),step:1,busy:false,config:null,configPromise:null,configRequest:0,telegramUrl:"",checkout:null,savedIdentity:"",expiresAt:0,request:0,officeRequest:0,retry:""};
  const activeRequests=new Set();
  const officeCache=new Map();
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  const selectWidgets=new Map();
  let autoplayTimer=0,gestureX=null,transitionId=0,openSelect=null;
  if(visual)visual.style.touchAction="pan-y";
  thumbs.forEach(button=>{const image=button.querySelector("img");if(image)image.style.transform="scale("+(Number(button.dataset.galleryZoom)||1)+")"});
  const initialThumb=thumbs.find(item=>item.getAttribute("aria-pressed")==="true");
  if(visual&&initialThumb)visual.style.backgroundSize=gallerySize(initialThumb);

  function createToken(){const bytes=new Uint8Array(24);crypto.getRandomValues(bytes);return btoa(String.fromCharCode(...bytes)).replaceAll("+","-").replaceAll("/","_").replaceAll("=","")}
  function modalOpen(){return Boolean(modal?.open)}
  function field(name){return form.elements[name]}
  function setStatus(text,error=false){if(!status)return;status.textContent=text;status.hidden=!error;status.style.color=error?"#9d214d":"";status.style.background=error?"#fff0f5":""}
  function localPhoneDigits(value){const raw=String(value),all=raw.replace(/\D/g,"");let digits=all;if((raw.trim().startsWith("+998")||digits.length>9)&&digits.startsWith("998"))digits=digits.slice(3);if(digits.length>9&&digits.startsWith("0"))digits=digits.slice(1);return digits.slice(0,9)}
  function formatLocalPhone(value){const digits=localPhoneDigits(value);return [digits.slice(0,2),digits.slice(2,5),digits.slice(5,7),digits.slice(7,9)].filter(Boolean).join(" ")}
  function normalizedPhone(){const digits=localPhoneDigits(field("phone").value);return digits?"+998 "+formatLocalPhone(digits):""}
  function phoneReady(){return localPhoneDigits(field("phone").value).length===9}
  function identityReady(){return field("full_name").value.trim().length>=2&&phoneReady()}
  function orderReady(){return identityReady()&&["region","district","post_type","post_office"].every(name=>field(name).value)}
  function payload(finalize=false){const data={token:state.token,product_code:productCode,full_name:field("full_name").value.trim(),phone:normalizedPhone()};if(finalize)Object.assign(data,{region:field("region").value,district:field("district").value,post_type:field("post_type").value,post_office_id:field("post_office").value,address_note:field("address_note").value.trim(),finalize:true});return data}
  function updateButton(){const ready=state.step===1?identityReady():orderReady();submit.disabled=state.busy||!ready;submit.textContent=state.busy?(state.step===1?"Davom etilmoqda…":"Tasdiqlanmoqda…"):(state.step===1?"Davom etish →":"Buyurtmani tasdiqlash");backButton.disabled=state.busy;steps.forEach(step=>step.disabled=state.busy||Number(step.dataset.step)!==state.step);form.setAttribute("aria-busy",String(state.busy))}
  function setRetry(kind=""){state.retry=kind;retryButton.hidden=!kind||state.step!==2;retryButton.disabled=state.busy}
  function showStep(number,focus=true){closeSelect();state.step=number;steps.forEach(step=>step.hidden=Number(step.dataset.step)!==number);backButton.hidden=number!==2;setRetry(state.retry);updateButton();setStatus("");modal.querySelector(".modal_inner").scrollTop=0;if(focus)steps[number-1].querySelector(".step_title").focus();if(number===2)loadConfig()}
  function money(value){const amount=Number(value);return Number.isFinite(amount)&&amount>0?String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g," ")+" soʻm":""}
  function paymentPanel(){let panel=modal.querySelector(".payment_panel");if(panel)return panel;panel=document.createElement("section");panel.className="payment_panel";panel.hidden=true;panel.tabIndex=-1;panel.setAttribute("aria-live","polite");panel.innerHTML='<p class="payment_success">✓ Buyurtma maʼlumotlari qabul qilindi</p><div class="payment_summary"><span>Tanlangan mahsulot</span><strong class="payment_product"></strong><b class="payment_amount"></b><small class="payment_description"></small></div><div class="payment_card"><span>Toʻlov uchun karta</span><strong class="payment_details"></strong></div><p class="payment_instruction">Mahsulot narxini kartaga toʻlang va chekni Telegram orqali yuboring. Toʻlov tasdiqlangach, buyurtmangiz tanlangan filialga joʻnatiladi.</p><a class="payment_action" href="#">Chekni yuborish / Admin bilan bogʻlanish</a><a class="payment_bot" href="#">Telegram botda davom etish</a>';form.after(panel);return panel}
  function showPayment(result){const panel=paymentPanel(),product=result.product||{},fallbackName=modal.querySelector(".modal_title")?.textContent.trim()||"Tanlangan mahsulot",fallbackPrice=modal.querySelector(".modal_price")?.textContent.trim()||"";panel.querySelector(".payment_product").textContent=product.name||fallbackName;panel.querySelector(".payment_amount").textContent=money(product.price)||fallbackPrice;const description=panel.querySelector(".payment_description");description.textContent=product.description||"";description.hidden=!description.textContent;const details=panel.querySelector(".payment_details");details.textContent=result.payment_details||"Karta rekvizitlari hali tayyorlanmagan. Admin bilan bogʻlaning.";const contact=panel.querySelector(".payment_action"),bot=panel.querySelector(".payment_bot"),support=result.support_url||"",telegram=result.telegram_url||state.telegramUrl;if(support){const message="Assalomu alaykum. "+(product.name||fallbackName)+" uchun toʻlov chekini yubormoqchiman.";contact.href=support+(support.includes("?")?"&":"?")+"text="+encodeURIComponent(message);contact.hidden=false}else contact.hidden=true;if(telegram){bot.href=telegram;bot.hidden=false}else bot.hidden=true;form.hidden=true;panel.hidden=false;modal.classList.add("has_payment");panel.focus()}
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
  async function api(path,options={}){if(!modalOpen())throw new DOMException("Modal yopilgan.","AbortError");const controller=new AbortController();activeRequests.add(controller);try{const response=await fetch(apiBase+path,{...options,signal:controller.signal,headers:{"Content-Type":"application/json","X-Requested-With":"HissetShop",...(options.headers||{})}});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||"Server bilan aloqa bo‘lmadi.");return data}catch(error){if(error.name==="AbortError")throw error;if(localPreview&&error instanceof TypeError)throw new Error("Lokal API serveri ishlamayapti. Terminalda node tools/serve.mjs 5177 ni ishga tushiring.");throw error}finally{activeRequests.delete(controller)}}
  function options(select,items,placeholder){select.innerHTML='<option value="">'+placeholder+'</option>'+items.map(item=>'<option value="'+escapeHtml(item)+'">'+escapeHtml(item)+'</option>').join("");select.disabled=false;syncSelect(select)}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
  async function loadConfig(){
    if(state.config||!modalOpen()||state.step!==2)return;
    if(state.configPromise)return state.configPromise;
    const request=++state.configRequest;
    setRetry();setStatus("Yetkazib berish manzillari yuklanmoqda…");
    const pending=(async()=>{
      try{
        const config=await api("/api/landing/config");
        if(request!==state.configRequest)return;
        state.config=config;
        options(field("region"),config.regions,"Viloyatni tanlang");
        options(field("post_type"),config.post_types,"Pochta turini tanlang");
        if(state.step===2)setStatus("Yetkazib berish joyini tanlang.");
      }catch(error){
        if(error.name!=="AbortError"&&request===state.configRequest&&modalOpen()){setRetry("config");if(state.step===2)setStatus(error.message,true)}
      }finally{if(request===state.configRequest)state.configPromise=null}
    })();
    state.configPromise=pending;return pending;
  }
  function resetOffices(text="Tuman va pochtani tanlang"){field("post_office").innerHTML='<option value="">'+text+'</option>';field("post_office").disabled=true;syncSelect(field("post_office"))}
  async function loadOffices(force=false){
    if(!modalOpen()||state.step!==2)return;
    const request=++state.officeRequest,region=field("region").value,district=field("district").value,type=field("post_type").value;
    resetOffices();setRetry();updateButton();
    if(!region||!district||!type)return;
    const query=String(new URLSearchParams({region,district,type}));
    if(force)officeCache.delete(query);
    field("post_office").innerHTML='<option value="">Filiallar yuklanmoqda…</option>';syncSelect(field("post_office"));
    setStatus("Pochta filiallari yuklanmoqda…");
    let pending=officeCache.get(query);
    if(!pending){pending=api("/api/landing/post-offices?"+query,{headers:{}});officeCache.set(query,pending)}
    try{
      const data=await pending;
      if(request!==state.officeRequest)return;
      const offices=data.offices||[];
      field("post_office").innerHTML='<option value="">Filialni tanlang</option>'+offices.map(office=>'<option value="'+escapeHtml(office.id)+'">'+escapeHtml(office.label)+'</option>').join("");
      field("post_office").disabled=!offices.length;syncSelect(field("post_office"));
      if(state.step===2)setStatus(offices.length?"Sizga qulay pochta filialini tanlang.":"Bu hududda tanlangan pochta filiali topilmadi.",!offices.length);
    }catch(error){
      if(officeCache.get(query)===pending)officeCache.delete(query);
      if(error.name!=="AbortError"&&request===state.officeRequest&&modalOpen()){setRetry("offices");if(state.step===2)setStatus(error.message,true)}
    }finally{if(request===state.officeRequest)updateButton()}
  }
  async function syncDraft(finalize=false){
    if(!modalOpen()||!identityReady()||state.busy)return null;
    const serialized=JSON.stringify(payload(finalize));
    if(!finalize&&serialized===state.savedIdentity&&Date.now()<state.expiresAt)return state.checkout;
    const request=++state.request;state.busy=true;updateButton();
    setStatus(finalize?"Buyurtma qabul qilinmoqda…":"Maʼlumotlar qabul qilinmoqda…");
    try{
      const result=await api("/api/landing/drafts",{method:"POST",body:serialized});
      if(request!==state.request)return null;
      if(!result.telegram_url)throw new Error("Buyurtmani saqlab boʻlmadi. Qayta urinib koʻring.");
      if(!finalize)state.savedIdentity=serialized;
      state.expiresAt=Date.now()+(Number(result.expires_in)||86400)*1000;
      state.telegramUrl=result.telegram_url;state.checkout=result;return result;
    }catch(error){
      if(error.name!=="AbortError"&&request===state.request&&modalOpen())setStatus(error.message,true);
      return null;
    }finally{if(request===state.request){state.busy=false;updateButton()}}
  }
  function stopModalRequests(){state.request++;state.configRequest++;state.officeRequest++;state.configPromise=null;state.busy=false;activeRequests.forEach(controller=>controller.abort());activeRequests.clear();updateButton();startAutoplay()}

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
  form?.addEventListener("input",event=>{if(!modalOpen()||state.busy)return;if(event.target.name==="phone")event.target.value=formatLocalPhone(event.target.value);event.target.setCustomValidity?.("");updateButton();if(state.step===1)setStatus("")});
  field("region")?.addEventListener("change",()=>{if(!modalOpen()||state.step!==2||state.busy)return;const districts=state.config?.districts?.[field("region").value]||[];options(field("district"),districts,"Shahar yoki tumanni tanlang");loadOffices()});
  field("district")?.addEventListener("change",()=>loadOffices());
  field("post_type")?.addEventListener("change",()=>loadOffices());
  field("post_office")?.addEventListener("change",()=>{if(!modalOpen()||state.step!==2||state.busy)return;updateButton();setStatus("Tayyor. Buyurtmani tasdiqlang.")});
  backButton.addEventListener("click",()=>{if(!state.busy)showStep(1)});
  retryButton.addEventListener("click",()=>{if(state.busy||state.step!==2)return;if(state.retry==="config")loadConfig();else if(state.retry==="offices")loadOffices(true)});
  form?.addEventListener("submit",async event=>{
    event.preventDefault();if(!modalOpen()||state.busy||form.hidden)return;
    field("full_name").setCustomValidity(field("full_name").value.trim().length>=2?"":"Ism-familiyangizni kiriting.");
    field("phone").setCustomValidity(phoneReady()?"":"Oʻzbekiston telefon raqamini toʻliq kiriting.");
    if(!identityReady()){if(state.step!==1)showStep(1);form.reportValidity();return}
    if(state.step===1){if(!form.reportValidity())return;const result=await syncDraft();if(result&&modalOpen())showStep(2);return}
    if(!orderReady()){const missing=["region","district","post_type","post_office"].map(field).find(select=>!select.value);selectWidgets.get(missing)?.button.focus();setStatus("Yetkazib berish joyini toʻliq tanlang.",true);return}
    if(!form.reportValidity())return;
    const result=await syncDraft(true);if(result&&modalOpen())showPayment(result);
  });
  showStep(1,false);
  startAutoplay();
});
