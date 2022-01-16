function validate(name, password){
    //radim samo validacije da li je podlje prazno ili ne
    if(name.trim() === ''){
        alert('name is not allowed to be empty');
        return 'err';
    }

    if(password.trim() === ''){
        alert('password is not allowed to be empty');
        return 'err';
    }

    return 'ok';
}

function init(){
    document.getElementById('btn').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            password: document.getElementById('password').value
        };

        if(validate(data.name, data.password) == 'err')
            return;

        fetch('http://127.0.0.1:9090/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                if(el.hasOwnProperty("status") && el.status === "error")
                    alert(el.message);
                else{
                    //TODO: el.token dobijem token koji treba na neki nacin da se dekriptuje da bih dobio da li je neko admin ili ne
                    
                    document.cookie = `token=${el.token};SameSite=Lax`;
                    window.location.href = '/admin/index';
                }
            });
    });
}