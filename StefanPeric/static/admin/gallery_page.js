function getGalleries(token){
    fetch('http://127.0.0.1:9000/api/galleries', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then( res => res.json() )
    .then( data => {
        const lst = document.getElementById('glryLst');

        data.forEach( el => {
            lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, Address: ${el.address}, Number: ${el.number}</li>`;
        });
    });
}

function validateId(id){
    if(id.trim() === ''){
        alert('id is not allowed to be empty');
        return 'err';
    }
    if(isNaN(id)){ 
        alert('id must be a number');
        return 'err';
    }
    return 'ok';
}

function validateF(name, address, number){
    if(name.trim() === ''){
        alert('name is not allowed to be empty');
        return 'err';
    }

    if(address.trim() === ''){
        alert('address is not allowed to be empty');
        return 'err';
    }

    if(number.trim() === ''){
        alert('number is not allowed to be empty');
        return 'err';
    }

    if(isNaN(number)){ 
        alert('number must be a number');
        return 'err';
    }
    return 'ok';
}


function init(){
    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    fetch('http://127.0.0.1:9000/api/galleries', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then( res => res.json() )
    .then( data => {
        const lst = document.getElementById('glryLst');

        data.forEach( el => {
            lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, Address: ${el.address}, Number: ${el.number}</li>`;
        });
    });

    document.getElementById('btnDelete').addEventListener('click', e => {
        e.preventDefault();

        var id = document.getElementById('delete').value;
        if(validateId(id) === 'err')
            return;
        document.getElementById('delete').value = '';
      
        fetch(`http://127.0.0.1:9000/api/galleries/${id}`, {
            method: 'DELETE',
            headers:  {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then( res => res.json() )
            .then(el => {
                if(el.msg)
                    alert('Bad id');
                else{
                    const lst = document.getElementById('glryLst');
                    lst.innerHTML = '';
                    getGalleries(token);
                }         
            })
            .catch(err => alert('id is not allowed to be empty'));
    });
   

    document.getElementById('btnGallery').addEventListener('click', e => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            number: document.getElementById('number').value,
        };

        if(validateF(data.name, data.address, data.number) === 'err')
            return;


        document.getElementById('name').value = '';
        document.getElementById('address').value = '';
        document.getElementById('number').value = '';
        

        fetch('http://127.0.0.1:9000/api/galleries', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                if(el.hasOwnProperty("status") && el.status === "error")
                    alert(el.message); 
                else{
                    const lst = document.getElementById('glryLst');
                    lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, Address: ${el.address}, Number: ${el.number}</li>`;
                }
            })
    });

    document.getElementById('btnUpdate').addEventListener('click', e => {
        e.preventDefault();
    
        var id = document.getElementById('idUpdate').value;
      
        const data = {
            name: document.getElementById('nameUpdate').value,
            address: document.getElementById('adressUpdate').value,
            number: document.getElementById('numberUpdate').value,
        };

        if(validateId(id) === 'err' || validateF(data.name,data.address, data.number) === 'err')
            return;

        document.getElementById('nameUpdate').value = '';
        document.getElementById('adressUpdate').value = '';
        document.getElementById('numberUpdate').value = '';
        
        document.getElementById('idUpdate').value = '';
        fetch(`http://127.0.0.1:9000/api/galleries/${id}`, {
            method: 'PUT',
            headers:  {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                if(el.hasOwnProperty("status") && el.status === "error")
                    alert(el.message);
                else{
                    const lst = document.getElementById('glryLst');
                    lst.innerHTML = '';
                    getGalleries(token);
                } 
            })
            .catch(err => alert('Neophodno je uneti id'));
    });
}