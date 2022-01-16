function init() {

    document.getElementById('btn').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            admin: 'false'
        };

        fetch('http://127.0.0.1:9090/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                if(el.hasOwnProperty("status") && el.status === "error")
                    alert(el.message); 
                else
                    window.location.href = '/login';
            })
            
    });
}