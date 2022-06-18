class Person{
    constructor(name,surname,mail){
        this.name=name;
        this.surname=surname;
        this.mail=mail;
    }
}


class Ui{
    constructor(){
        this.form = document.querySelector(".form").addEventListener("submit",this.getPersonValue.bind(this));
        this.namee = document.getElementById("namee");
        this.surname = document.getElementById("surnamee");
        this.mail = document.getElementById("mail");
        this.body = document.querySelector(".body");
        this.button = document.querySelector(".btn");
        this.storage = new Storage();
        this.loadStorage();
        this.selectedRow=undefined;
        this.body.addEventListener("click",this.updateOrDelete.bind(this));
       
    }
    loadStorage(){
        this.storage.persons.forEach(p=>{
            this.addPersontoUi(p);
        })
        
    }

    cleanInputs(){
        this.namee.value = ""
        this.surname.value = ""
        this.mail.value = ""
        
    }

    addPersontoUi(person){
        const createTr = document.createElement("tr");
        createTr.innerHTML=`<td>${person.name}</td>
        <td>${person.surname}</td>
        <td>${person.mail}</td>
        <td><button class="delete" ><i class="fa-solid fa-trash"></i></button></i> <button class="edit"><i class="fa-solid fa-file-pen"></i></button></td>`

        this.body.appendChild(createTr)

        
    }

    deletePersonToUi(){
        this.selectedRow.remove();
        const theDeleteToMail = this.selectedRow.children[2].textContent;
        this.storage.deletePersonToData(theDeleteToMail);
        this.selectedRow=undefined;
    }

    updatePersonToUi(person){
        const theUpdateToMail = this.selectedRow.children[2].textContent;
        this.storage.updatePersonToData(person,theUpdateToMail)
        
        this.selectedRow.children[0].textContent = person.name;
        this.selectedRow.children[1].textContent = person.surname;
        this.selectedRow.children[2].textContent = person.mail;


        this.button.textContent="SAVE"



    }

    getPersonValue(e){
        e.preventDefault();
       
        const person = new Person(this.namee.value,this.surname.value,this.mail.value);
        const result = checkUi.checkSpace(person.name,person.surname,person.mail);

        if(result){


            if(this.selectedRow){
                this.updatePersonToUi(person);
            }else{
                this.addPersontoUi(person);
                this.storage.setData(person);

            }
                this.cleanInputs();

        }else{
            console.log("başarısız");
        }
        
    }

    updateOrDelete(e){
        const clickedPoint = e.target;

        if(clickedPoint.className === "fa-solid fa-trash"){
            this.selectedRow = clickedPoint.parentElement.parentElement.parentElement;
            this.deletePersonToUi();
        }else if(clickedPoint.className === "fa-solid fa-file-pen"){
            this.selectedRow=clickedPoint.parentElement.parentElement.parentElement;
            this.button.textContent="UPDATE"

            this.namee.value=this.selectedRow.children[0].textContent;
            this.surname.value=this.selectedRow.children[1].textContent;
            this.mail.value=this.selectedRow.children[2].textContent;
            this.addPersontoUi();

        }

    }


}


class checkUi{
    static checkSpace(...arg){
        let result=true;

        arg.forEach(r=>{
            if(r.length===0){
                result=false;
                return result;
            }else{
                result=true;
            }
        })
        return result;
    }
}

class Storage{
    constructor(){
        this.persons = this.getData();
    }

    getData(){
        let data;
        if(localStorage.getItem("person")===null){
            data=[];
        }else{
            data=JSON.parse(localStorage.getItem("person"));
        }
        return data;
    }

    setData(person){
        

        this.persons.push(person);

        localStorage.setItem("person",JSON.stringify(this.persons));

    }
    deletePersonToData(mail){
        this.persons.forEach((person,index)=>{
            if(person.mail ===mail){
                this.persons.splice(index,1);
            }
        });
        localStorage.setItem("person",JSON.stringify(this.persons));
    }
    updatePersonToData(updatedPerson,mail){
        this.persons.forEach((person,index)=>{
            if(person.mail ===mail){
                this.persons[index]= updatedPerson;
            }
        })
        localStorage.setItem("person",JSON.stringify(this.persons));
    }

}

document.addEventListener("DOMContentLoaded",function(e){
    const ui = new Ui();
});