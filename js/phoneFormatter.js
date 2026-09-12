const p = [
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Tajikistan", code: "+992", flag: "🇹🇯" },
  { name: "Qirg'iziston", code: "+996", flag: "🇰🇬" },
  { name: "Qozog'iston", code: "+7", flag: "🇰🇿" },
  { name: "Turkmaniston", code: "+993", flag: "🇹🇲" },
  { name: "AQSH", code: "+1", flag: "🇺🇸" },
  { name: "Janubiy Koreya", code: "+82", flag: "🇰🇷" },
  { name: "Turkiya", code: "+90", flag: "🇹🇷" },
  { name: "Rossiya", code: "+7", flag: "🇷🇺" },
  { name: "BAA (Dubay)", code: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Polsha", code: "+48", flag: "🇵🇱" },
  { name: "Czechia", code: "+420", flag: "🇨🇿" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮" },
  { name: "Croatia", code: "+385", flag: "🇭🇷" },
  { name: "Bosnia & Herzegovina", code: "+387", flag: "🇧🇦" },
  { name: "Serbia", code: "+381", flag: "🇷🇸" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪" },
  { name: "North Macedonia", code: "+389", flag: "🇲🇰" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Moldova", code: "+373", flag: "🇲🇩" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "Belarus", code: "+375", flag: "🇧🇾" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹" },
  { name: "Latvia", code: "+371", flag: "🇱🇻" },
  { name: "Estonia", code: "+372", flag: "🇪🇪" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "Iceland", code: "+354", flag: "🇮🇸" },
  { name: "Malta", code: "+356", flag: "🇲🇹" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },
  { name: "Monaco", code: "+377", flag: "🇲🇨" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮" },
  { name: "Kosovo", code: "+383", flag: "🇽🇰" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Nepal", code: "+977", flag: "🇳🇵" },
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Cambodia", code: "+855", flag: "🇰🇭" },
  { name: "Laos", code: "+856", flag: "🇱🇦" },
  { name: "Myanmar", code: "+95", flag: "🇲🇲" },
  { name: "Mongolia", code: "+976", flag: "🇲🇳" },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰" },
  { name: "Macau", code: "+853", flag: "🇲🇴" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Brunei", code: "+673", flag: "🇧🇳" },
  { name: "Timor-Leste", code: "+670", flag: "🇹🇱" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Syria", code: "+963", flag: "🇸🇾" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Iran", code: "+98", flag: "🇮🇷" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Palestine", code: "+970", flag: "🇵🇸" },
  { name: "Yemen", code: "+967", flag: "🇾🇪" },
];

g = {
  "+44": { ph: "7400 123 456", g: [4, 3, 3] },
  "+353": { ph: "83 123 4567", g: [2, 3, 4] },
  "+33": { ph: "6 12 34 56 78", g: [1, 2, 2, 2, 2] },
  "+49": { ph: "1512 3456789", g: [4, 7] },
  "+39": { ph: "312 345 6789", g: [3, 3, 4] },
  "+34": { ph: "612 34 56 78", g: [3, 2, 2, 2] },
  "+351": { ph: "912 345 678", g: [3, 3, 3] },
  "+31": { ph: "6xx 123 4567", g: [3, 3, 4] },
  "+32": { ph: "4xx 12 34 56", g: [3, 2, 2, 2] },
  "+352": { ph: "621 234 567", g: [3, 3, 3] },
  "+41": { ph: "79 123 45 67", g: [2, 3, 2, 2] },
  "+43": { ph: "650 123 4567", g: [3, 3, 4] },
  "+48": { ph: "123 456 789", g: [3, 3, 3] },
  "+420": { ph: "123 456 789", g: [3, 3, 3] },
  "+421": { ph: "912 345 678", g: [3, 3, 3] },
  "+36": { ph: "30 123 4567", g: [2, 3, 4] },
  "+386": { ph: "31 234 567", g: [2, 3, 3] },
  "+385": { ph: "91 234 5678", g: [2, 3, 4] },
  "+387": { ph: "61 234 567", g: [2, 3, 3] },
  "+381": { ph: "60 123 4567", g: [2, 3, 4] },
  "+382": { ph: "67 123 456", g: [2, 3, 3] },
  "+389": { ph: "70 123 456", g: [2, 3, 3] },
  "+355": { ph: "68 123 4567", g: [2, 3, 4] },
  "+30": { ph: "691 234 5678", g: [3, 3, 4] },
  "+359": { ph: "87 123 4567", g: [2, 3, 4] },
  "+40": { ph: "712 345 678", g: [3, 3, 3] },
  "+373": { ph: "621 234 567", g: [3, 3, 3] },
  "+380": { ph: "67 123 4567", g: [2, 3, 4] },
  "+375": { ph: "29 123 45 67", g: [2, 3, 2, 2] },
  "+370": { ph: "612 34567", g: [3, 5] },
  "+371": { ph: "21 234 567", g: [2, 3, 3] },
  "+372": { ph: "5123 4567", g: [4, 4] },
  "+47": { ph: "412 34 567", g: [3, 2, 3] },
  "+46": { ph: "7xx 123 456", g: [3, 3, 3] },
  "+45": { ph: "12 34 56 78", g: [2, 2, 2, 2] },
  "+358": { ph: "40 123 4567", g: [2, 3, 4] },
  "+354": { ph: "611 2345", g: [3, 4] },
  "+356": { ph: "9912 3456", g: [4, 4] },
  "+357": { ph: "96 123 456", g: [2, 3, 3] },
  "+377": { ph: "6 12 34 56 78", g: [1, 2, 2, 2, 2] },
  "+376": { ph: "612 345", g: [3, 3] },
  "+423": { ph: "79 123 45 67", g: [2, 3, 2, 2] },
  "+383": { ph: "43 123 456", g: [2, 3, 3] },
  "+995": { ph: "555 12 34 56", g: [3, 2, 2, 2] },
  "+994": { ph: "50 123 45 67", g: [2, 3, 2, 2] },
  "+374": { ph: "91 234 567", g: [2, 3, 3] },
  "+7": { ph: "900 123 4567", g: [3, 3, 4] },
  "+998": { ph: "88 888 88 88", g: [2, 3, 2, 2] },
  "+992": { ph: "55 555 5555", g: [2, 3, 4] },
  "+996": { ph: "555 123 456", g: [3, 3, 3] },
  "+993": { ph: "6 123 4567", g: [1, 3, 4] },
  "+1": { ph: "555 123 4567", g: [3, 3, 4] },
  "+82": { ph: "10 1234 5678", g: [2, 4, 4] },
  "+90": { ph: "5xx 123 45 67", g: [3, 3, 2, 2] },
  "+971": { ph: "50 123 4567", g: [2, 3, 4] },
  "+86": { ph: "131 2345 6789", g: [3, 4, 4] },
  "+81": { ph: "90 1234 5678", g: [2, 4, 4] },
  "+91": { ph: "91234 56789", g: [5, 5] },
  "+92": { ph: "301 234 5678", g: [3, 3, 4] },
  "+880": { ph: "17 1234 5678", g: [2, 4, 4] },
  "+94": { ph: "71 234 5678", g: [2, 3, 4] },
  "+977": { ph: "981 234 5678", g: [3, 3, 4] },
  "+93": { ph: "70 123 4567", g: [2, 3, 4] },
  "+62": { ph: "812 1234 5678", g: [3, 4, 4] },
  "+60": { ph: "12 345 6789", g: [2, 3, 4] },
  "+65": { ph: "8123 4567", g: [4, 4] },
  "+66": { ph: "81 234 5678", g: [2, 3, 4] },
  "+84": { ph: "91 234 5678", g: [2, 3, 4] },
  "+63": { ph: "912 345 6789", g: [3, 3, 4] },
  "+855": { ph: "12 345 678", g: [2, 3, 3] },
  "+856": { ph: "20 1234 5678", g: [2, 4, 4] },
  "+95": { ph: "9 1234 5678", g: [1, 4, 4] },
  "+976": { ph: "8812 3456", g: [4, 4] },
  "+852": { ph: "5123 4567", g: [4, 4] },
  "+853": { ph: "6612 3456", g: [4, 4] },
  "+960": { ph: "771 2345", g: [3, 4] },
  "+673": { ph: "712 3456", g: [3, 4] },
  "+670": { ph: "77 123 456", g: [2, 3, 3] },
  "+966": { ph: "50 123 4567", g: [2, 3, 4] },
  "+974": { ph: "3312 3456", g: [4, 4] },
  "+965": { ph: "5001 2345", g: [4, 4] },
  "+968": { ph: "9212 3456", g: [4, 4] },
  "+973": { ph: "3412 3456", g: [4, 4] },
  "+962": { ph: "7 9012 3456", g: [1, 4, 4] },
  "+961": { ph: "71 234 567", g: [2, 3, 3] },
  "+963": { ph: "93 123 4567", g: [2, 3, 4] },
  "+964": { ph: "770 123 4567", g: [3, 3, 4] },
  "+98": { ph: "912 345 6789", g: [3, 3, 4] },
  "+972": { ph: "50 123 4567", g: [2, 3, 4] },
  "+970": { ph: "59 123 4567", g: [2, 3, 4] },
  "+967": { ph: "71 234 5678", g: [2, 3, 4] },
};

function setupPhoneFormatter({
  phoneInput,
  selectedCountryBtn,
  selectedFlagEl,
  selectedCodeEl,
  dropdownEl,
  dropdownIconEl,
  errorEl,
  defaultCode = "+998",
  countries,
  formatMap,
}) {
  if (
    !phoneInput ||
    !selectedCountryBtn ||
    !selectedFlagEl ||
    !selectedCodeEl ||
    !dropdownEl
  ) {
    return null;
  }
  if (!countries || !Array.isArray(countries) || !formatMap) return null;

  const extractCodeOnly = (val) =>
    String(val || "").match(/\+\d+/)?.[0] || "+998";
  let currentCode = extractCodeOnly(defaultCode);

  const findCountryByCode = (code) =>
    countries.find((c) => c.code === code) ||
    countries.find((c) => c.code === "+998") ||
    countries[0];

  const getConfig = (code) => {
    const cfg = formatMap[code] || formatMap["+998"];
    const groups = cfg.g;

    return {
      placeholder: cfg.ph,
      maxLen: groups.reduce((s, x) => s + x, 0) + (groups.length - 1),
      validate: new RegExp(
        "^" + groups.map((x) => `\\d{${x}}`).join("\\s") + "$"
      ),
      formatDigits(digits) {
        const parts = [];
        let idx = 0;
        for (const size of groups) {
          if (idx >= digits.length) break;
          parts.push(digits.slice(idx, idx + size));
          idx += size;
        }
        return parts.join(" ");
      },
    };
  };

  const setIcon = (open) => {
    if (!dropdownIconEl) return;
    dropdownIconEl.innerHTML = open
      ? '<polyline points="18 15 12 9 6 15"></polyline>'
      : '<polyline points="6 9 12 15 18 9"></polyline>';
  };

  const renderSelected = () => {
    const country = findCountryByCode(currentCode);
    selectedFlagEl.textContent = country.flag || "🌍";
    selectedCodeEl.textContent = currentCode;
  };

  const closeDropdown = () => {
    dropdownEl.style.display = "none";
    setIcon(false);
  };

  const openDropdown = () => {
    dropdownEl.innerHTML = "";

    countries.forEach((country) => {
      const opt = document.createElement("div");
      opt.className =
        "country-option" + (country.code === currentCode ? " selected" : "");

      opt.innerHTML = `
        <span class="country-name">${country.name}</span>
        <div style="display:flex; gap:8px; align-items:center;">
          <span class="country-code">${country.code}</span>
          <span class="country-flag" aria-hidden="true">${
            country.flag || "🌍"
          }</span>
        </div>
      `;

      opt.addEventListener("click", () => {
        currentCode = country.code;
        renderSelected();

        const cfg = getConfig(currentCode);
        phoneInput.placeholder = cfg.placeholder;
        phoneInput.maxLength = cfg.maxLen;
        phoneInput.value = "";

        if (errorEl) errorEl.style.display = "none";
        closeDropdown();
      });

      dropdownEl.appendChild(opt);
    });

    dropdownEl.style.display = "block";
    setIcon(true);
  };

  const detectCodeFromPlus = (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed.startsWith("+")) return null;

    const codes = Object.keys(formatMap).sort((a, b) => b.length - a.length);
    for (const code of codes) if (trimmed.startsWith(code)) return code;
    return null;
  };

  const applyValue = (raw) => {
    if (!raw) {
      phoneInput.value = "";
      return;
    }

    const trimmed = raw.trim();
    let rest = trimmed;

    const maybeCode = detectCodeFromPlus(trimmed);
    if (maybeCode && maybeCode !== currentCode) {
      currentCode = maybeCode;
      renderSelected();
      rest = trimmed.slice(maybeCode.length);
    } else if (maybeCode) {
      rest = trimmed.slice(maybeCode.length);
    }

    const cfg = getConfig(currentCode);
    const digits = rest.replace(/\D/g, "");
    phoneInput.placeholder = cfg.placeholder;
    phoneInput.maxLength = cfg.maxLen;
    phoneInput.value = cfg.formatDigits(digits);
  };

  function toggle(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (dropdownEl.style.display === "block") closeDropdown();
    else openDropdown();
  }

  selectedCountryBtn.addEventListener("click", toggle);
  selectedCountryBtn.addEventListener("touchstart", toggle, { passive: false });

  dropdownEl.addEventListener("click", (ev) => ev.stopPropagation());
  document.addEventListener("click", (ev) => {
    if (
      selectedCountryBtn.contains(ev.target) ||
      dropdownEl.contains(ev.target)
    )
      return;
    closeDropdown();
  });

  phoneInput.addEventListener("input", (ev) => {
    applyValue(ev.target.value);
    if (errorEl) errorEl.style.display = "none";
  });

  phoneInput.addEventListener("change", (ev) => applyValue(ev.target.value));

  renderSelected();
  const cfg = getConfig(currentCode);
  phoneInput.placeholder = cfg.placeholder;
  phoneInput.maxLength = cfg.maxLen;

  return {
    getCurrentCode: () => currentCode,
    validate: (val) =>
      getConfig(currentCode).validate.test(String(val || "").trim()),
  };
}

document.addEventListener("DOMContentLoaded", () => {
  window.phoneFormatter = setupPhoneFormatter({
    phoneInput: document.getElementById("phone"),
    selectedCountryBtn: document.getElementById("selectedCountry"),
    selectedFlagEl: document.getElementById("selectedCountryFlag"),
    selectedCodeEl: document.getElementById("selectedCountryCodeText"),
    dropdownEl: document.getElementById("countryDropdown"),
    dropdownIconEl: document.getElementById("dropdownIcon"),
    errorEl: document.getElementById("phoneError"),
    defaultCode: "+998",
    countries: p,
    formatMap: g,
  });
});