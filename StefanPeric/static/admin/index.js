function getUsers(token){
    fetch('http://127.0.0.1:9000/api/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then( res => res.json() )
    .then( data => {
        if(data.hasOwnProperty("status") && data.status === "error")
            alert(data.message); 
        else{ 
            const lst = document.getElementById('usrLst');

            data.forEach( el => {
                lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}</li>`;
            });
        }
    })
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

function validateF(name, email, password){
    if(name.trim() === ''){
        alert('name is not allowed to be empty');
        return 'err';
    }

    if(password.trim() === ''){
        alert('password is not allowed to be empty');
        return 'err';
    }

    if(email.trim() === ''){
        alert('email is not allowed to be empty');
        return 'err';
    }

    return 'ok';
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function init(){
    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
    
    var obj = parseJwt(token);

    if(obj.admin === false){ 
        document.getElementById('adminPanel').style.display = 'none';
    }else{ 
        fetch('http://127.0.0.1:9000/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then( res => res.json() )
            .then( data => {
                const lst = document.getElementById('usrLst');
                if(data.hasOwnProperty("status") && data.status === "error")
                    alert(data.message); 
                else{ 
                    data.forEach( el => {
                        lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}`;
                    });
                }
            });
        
        document.getElementById('btnDelete').addEventListener('click', e => {
            e.preventDefault();

            var id = document.getElementById('delete').value;
            if(validateId(id) === 'err')
                return;
    
            document.getElementById('delete').value = '';
        
            fetch(`http://127.0.0.1:9000/api/users/${id}`, {
                method: 'DELETE',
                headers:  {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then( res => res.json() )
                .then(data => {
                    if(data.hasOwnProperty("status") && data.status === "error")
                        alert(data.message); 
                    else{
                        const lst = document.getElementById('usrLst');
                        lst.innerHTML = '';
                        getUsers(token); 
                    }
                })
                .catch(err => alert('id is not allowed to be empty'));
        });
    

        document.getElementById('btn').addEventListener('click', e => {
            e.preventDefault();
            
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                admin: document.getElementById('admin').checked
            };

            if(validateF(data.name, data.email, data.password) === 'err')
                return;


            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('admin').checked = '';
            

            fetch('http://127.0.0.1:9000/api/users', {
                method: 'POST',
                headers:  {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( data => {
                    if(data.hasOwnProperty("status") && data.status === "error")
                        alert(data.message); 
                    else{ 
                        const lst = document.getElementById('usrLst');
                        lst.innerHTML += `<li>ID: ${data.id}, Name: ${data.name}</li>`;
                    }
                });

        });

        document.getElementById('btnUpdate').addEventListener('click', e => {
            e.preventDefault();
        
            var id = document.getElementById('idUpdate').value;
        
            const data = {
                name: document.getElementById('nameUpdate').value,
                email: document.getElementById('emailUpdate').value,
                password: document.getElementById('passwordUpdate').value,
                admin: document.getElementById('adminUpdate').checked
            };

            if(validateId(id) === 'err' || validateF(data.name,data.email, data.password) === 'err')
                return;


            document.getElementById('nameUpdate').value = '';
            document.getElementById('emailUpdate').value = '';
            document.getElementById('passwordUpdate').value = '';
            document.getElementById('adminUpdate').checked = '';

            document.getElementById('idUpdate').value = '';
            fetch(`http://127.0.0.1:9000/api/users/${id}`, {
                method: 'PUT',
                headers:  {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( data => {

                    if(data.hasOwnProperty("status") && data.status === "error")
                        alert(data.message);
                    else{ 
                        const lst = document.getElementById('usrLst');
                        lst.innerHTML = '';
                        getUsers(token);
                    } 
                })
                .catch(err => alert('Neophodno je uneti id'));
        });
    }

    document.getElementById('logout').addEventListener('click', e => {
        document.cookie = `token=;SameSite=Lax`;
        window.location.href = '/login';
    });
}