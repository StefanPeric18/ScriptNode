function getArtists(token){
    fetch('http://127.0.0.1:9000/api/artists', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then( res => res.json() )
    .then( data => {
        const lst = document.getElementById('artistsLst');

        data.forEach( el => {
            lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, Nationality: ${el.nationality}</li>`;
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

function validateF(name, nationality){
    if(name.trim() === ''){
        alert('name is not allowed to be empty');
        return 'err';
    }

    if(nationality.trim() === ''){
        alert('nationality is not allowed to be empty');
        return 'err';
    }

    return 'ok';
}

function init(){

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    fetch('http://127.0.0.1:9000/api/artists', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then( res => res.json() )
    .then( data => {
        const lst = document.getElementById('artistsLst');

        data.forEach( el => {
            lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, Nationality: ${el.nationality}</li>`;
        });
    });


    document.getElementById('btnDelete').addEventListener('click', e => {
        e.preventDefault();

        var id = document.getElementById('delete').value;
        if(validateId(id) === 'err')
            return;
        document.getElementById('delete').value = '';
      
        fetch(`http://127.0.0.1:9000/api/artists/${id}`, {
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
                    const lst = document.getElementById('artistsLst');
                    lst.innerHTML = '';
                    getArtists(token);
                }         
            })
            .catch(err => alert('id is not allowed to be empty'));
    });

    document.getElementById('btnArtists').addEventListener('click', e => {
        e.preventDefault();


        const data = {
            name: document.getElementById('name').value,
            nationality: document.getElementById('nationality').value,
        };

        if(validateF(data.name, data.nationality) === 'err')
            return;

        document.getElementById('name').value = '';
        document.getElementById('nationality').value = '';
        

        fetch('http://127.0.0.1:9000/api/artists', {
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
                    const lst = document.getElementById('artistsLst');
                    lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, Nationality: ${el.nationality}</li>`;
                }
            })
        
            
            
    });

    document.getElementById('btnUpdate').addEventListener('click', e => {
        e.preventDefault();
    
        var id = document.getElementById('idUpdate').value;
      
        const data = {
            name: document.getElementById('nameUpdate').value,
            nationality: document.getElementById('nationalityUpdate').value,
        };

        if(validateId(id) === 'err' || validateF(data.name,data.nationality) === 'err')
            return;

        document.getElementById('nameUpdate').value = '';
        document.getElementById('nationalityUpdate').value = '';
        
        document.getElementById('idUpdate').value = '';
        fetch(`http://127.0.0.1:9000/api/artists/${id}`, {
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
                    const lst = document.getElementById('artistsLst');
                    lst.innerHTML = '';
                    getArtists(token);
                } 
            })
            .catch(err => alert('Neophodno je uneti id'));
            
    });

    
}