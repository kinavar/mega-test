
(function() {

    const crypto = window["CryptoJS"];
    const form = document.querySelector(".file-form");
    const filepath = document.getElementById("filepath");
    const fileInput = document.getElementById("file");
    const fileTableBody = document.querySelector(".file-body-container");
    
    const encryptMessage = (message, passpharase) => {
        return crypto.AES.encrypt(message, passpharase);
    }

    const triggerFileIput = () => {
        fileInput.click();
    }

    const updateFilePath = e => {
        filepath.value = e.currentTarget.files[0].name;
    }

    const encodeFile = file => {
        const reader = new FileReader();
        
        reader.readAsText(file);

        return new Promise(resolve => {
            reader.addEventListener("load", e => {
                resolve(e.target.result);
            });
        });
    }

    const sendFile = async(data) => {
        return fetch("/api/files", {
            method: "POST",
            body: JSON.stringify(data)
        });
    } 

    const createFileTemplate = ({path, date }) => {
        const template = document.getElementById("file-template").content.cloneNode(true);
        template.querySelector(".date").textContent = date;
        template.querySelector(".path").textContent = path;
        return template;
    }

    const throwErrorMessage = () => {
        const message = document.createElement("p");
        message.classList.add("error-message");
        message.textContent = "There is a problem uploading your file";
        form.appendChild(message);
    }

    const clearError = () => {
        const error =  document.querySelector(".error-message");
        
        if(!error) {
            return;
        }

       error.remove();
    }

    const handleForm = async(e)=> {
        e.preventDefault();
        clearError();
    
        const pathPhrase = e.currentTarget.querySelector("[name='password']").value;
        const file = form.querySelector("[name='file']").files[0];
        const fileTemplate = createFileTemplate({path: file.name, date: new Date().toLocaleDateString()});
        const encodedFile = await encodeFile(file);
        const encryptedFile = encryptMessage(encodedFile, pathPhrase).toString();

        fileTableBody.appendChild(fileTemplate);

        const response = await sendFile({encryptedFile});

        if(!response.ok) {
            throwErrorMessage();
        } else {
            form.reset();
        }
    }
    const init = () => {       
        fileInput.addEventListener("change", updateFilePath);
        filepath.addEventListener("click", triggerFileIput);
        form.addEventListener("submit", handleForm);
    }

    document.addEventListener("DOMContentLoaded", () => {
        init();
    })
})()
