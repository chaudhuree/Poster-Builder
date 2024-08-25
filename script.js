// DOM elements
const componentButtons = document.getElementById("componentButtons");
const contentSections = document.getElementById("contentSections");
const previewPanel = document.getElementById("previewPanel");
const previewHeading = document.getElementById("previewHeading");
const previewDescription = document.getElementById("previewDescription");
const previewImage = document.getElementById("previewImage");
const downloadBtn = document.getElementById("downloadBtn");

// State
let headingText = "";
let descriptionText = "";
let imageUrl = "";

// Event listeners
componentButtons.addEventListener("click", handleComponentClick);
contentSections.addEventListener("input", handleInput);
contentSections.addEventListener("click", handleContentSectionClick);
downloadBtn.addEventListener("click", downloadPoster);

function handleComponentClick(e) {
  if (e.target.tagName === "BUTTON") {
    const componentType = e.target.id.replace("Btn", "");
    createContentSection(componentType);
    e.target.classList.add("hidden");
  }
}

function createContentSection(type) {
  const section = document.createElement("div");
  section.className = " border p-4 rounded-lg mb-6";
  section.dataset.type = type;

  let inputHtml = "";
  if (type === "heading") {
    inputHtml = `
            <input type="text" class="input w-full mb-2" value="${headingText}" placeholder="Enter heading">
            <div class="flex flex-col  md:flex-row flex-wrap justify-between sm:items-center gap-y-5 mt-5">
                <!-- left part  -->
                <div class="border w-fit flex items-center rounded-lg">
                    <button class="btn hover:bg-gray-100 bg-white border " data-style="left"><i class="ri-align-left mr-2"></i><span>Left</span></button>
                    <button class="btn hover:bg-gray-100 bg-white border " data-style="center"><i class="ri-align-center mr-2"></i>Center</button>
                    <button class="btn hover:bg-gray-100 bg-white border " data-style="right"><i class="ri-align-right mr-2"></i>Right</button>
                </div>
                <div class="border w-fit flex items-center rounded-lg">
                    <button class="btn hover:bg-gray-100 bg-white border " data-style="blue"><i class="ri-circle-fill text-blue-400 mr-2"></i>Blue</button>
                    <button class="btn hover:bg-gray-100 bg-white border " data-style="dark"><i class="ri-circle-fill text-black mr-2"></i>Black</button>
                    <button class="btn hover:bg-gray-100 bg-white border " data-style="green"><i class="ri-circle-fill text-green-400 mr-2"></i>Green</button>
                </div>
            
            </div>
        `;
  } else if (type === "description") {
    inputHtml = `
            <textarea placeholder="Write your thoughts here..." class="input w-full h-[100px]" placeholder="Enter description">${descriptionText}</textarea>
        `;
  } else if (type === "image") {
    inputHtml = `
            <div class="imageUpload h-60 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer flex-col text-gray-400">
                <i class="ri-upload-cloud-2-line text-4xl mb-4"></i>
                <p class="font-bold mb-2">Click to upload  <span class="font-normal">or drag and drop</span></p>
                <p>SVG, PNG, JPG or GIF (MAX. 800x400px)</P>
            </div>
        `;
  }

  section.innerHTML = `
        <div class="flex relative justify-between items-center mb-[28px]">
            <h3 class="absolute -top-[28px] -left-[9px]  bg-gray-200 px-4 py-1 text-sm font-medium rounded-full">${
              type.charAt(0).toUpperCase() + type.slice(1)
            }</h3>
            <button class="closeBtn text-red-500 bg-white px-2 pt-0.5 pb-1 rounded-full absolute -right-[29px] -top-[32px] cursor-pointer">&times;</button>
        </div>
        ${inputHtml}
    `;

  // Insert the section in the correct order
  const order = ["heading", "image", "description"];
  const index = order.indexOf(type);
  const existingSections = contentSections.querySelectorAll("div[data-type]");
  let inserted = false;

  for (let i = index + 1; i < order.length; i++) {
    const nextSection = contentSections.querySelector(
      `div[data-type="${order[i]}"]`
    );
    if (nextSection) {
      contentSections.insertBefore(section, nextSection);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    contentSections.appendChild(section);
  }

  if (type === "image") {
    section
      .querySelector(".imageUpload")
      .addEventListener("click", uploadImage);
  }

  addTailwindClasses();
}

function handleContentSectionClick(e) {
  if (e.target.classList.contains("closeBtn")) {
    const section = e.target.closest("div[data-type]");
    const type = section.dataset.type;
    section.remove();
    document.getElementById(`${type}Btn`).classList.remove("hidden");
  } else if (e.target.dataset.style) {
    applyStyle(e.target.dataset.style);
  }
}

function handleInput(e) {
  const section = e.target.closest("div[data-type]");
  const type = section.dataset.type;
  if (type === "heading") {
    headingText = e.target.value;
    previewHeading.textContent = headingText;
  } else if (type === "description") {
    descriptionText = e.target.value;
    previewDescription.textContent = descriptionText;
  }
}

function applyStyle(style) {
  if (["left", "center", "right"].includes(style)) {
    previewHeading.classList.remove("text-left", "text-center", "text-right");
    previewHeading.classList.add(`text-${style}`);
  } else if (["green", "blue", "dark"].includes(style)) {
    previewHeading.classList.remove(
      "text-green-400",
      "text-blue-400",
      "text-black"
    );
    if (style === "dark") {
      previewHeading.classList.add("text-black");
    } else {
      previewHeading.classList.add(`text-${style}-400`);
    }
  }
}

function uploadImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imageUrl = event.target.result;
        previewImage.src = imageUrl;
        previewImage.style.display = "block";
        previewImage.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function downloadPoster() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    // Set canvas size to match the preview panel
    const previewPanel = document.getElementById('previewPanel');
    canvas.width = previewPanel.offsetWidth;
    canvas.height = previewPanel.offsetHeight;
  
    // Fill the background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw the heading
    const heading = document.getElementById('previewHeading');
    ctx.font = getComputedStyle(heading).font;
    ctx.fillStyle = getComputedStyle(heading).color;
    
    // Get the text alignment
    const textAlign = getComputedStyle(heading).textAlign;
    ctx.textAlign = textAlign;
  
    // Calculate x position based on alignment
    let x;
    if (textAlign === 'left') x = 10;
    else if (textAlign === 'right') x = canvas.width - 10;
    else x = canvas.width / 2; // center
  
    // Add top padding
    const topPadding = 50;
  
    wrapText(ctx, heading.textContent, x, topPadding, canvas.width - 40, parseInt(getComputedStyle(heading).lineHeight));
  
    // Draw the image
    const image = document.getElementById('previewImage');
    if (!image.classList.contains('hidden')) {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      const imgWidth = Math.min(canvas.width - 40, 500);
      const imgHeight = imgWidth / aspectRatio;
      ctx.drawImage(image, (canvas.width - imgWidth) / 2, topPadding + 100, imgWidth, imgHeight);
    }
  
    // Draw the description
    const description = document.getElementById('previewDescription');
    ctx.font = getComputedStyle(description).font;
    ctx.fillStyle = getComputedStyle(description).color;
    ctx.textAlign = 'left';
    const descriptionY = image.classList.contains('hidden') ? topPadding + 100 : topPadding + 600;
    wrapText(ctx, description.textContent, 20, descriptionY, canvas.width - 40, parseInt(getComputedStyle(description).lineHeight));
  
    // Convert canvas to JPG and trigger download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'poster.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/jpeg');
  }

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function addTailwindClasses() {
  const btnClass = " font-bold py-2 px-4 rounded";
  const inputClass = "border border-gray-300 p-2 rounded";

  document
    .querySelectorAll(".btn")
    .forEach((btn) => (btn.className += " " + btnClass));
  document
    .querySelectorAll(".input")
    .forEach((input) => (input.className += " " + inputClass));
}

addTailwindClasses();
