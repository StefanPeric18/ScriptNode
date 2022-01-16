function getArtworks(token){
    fetch('http://127.0.0.1:9000/api/artworks', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then( res => res.json() )
    .then( data => {
        const lst = document.getElementById('artworksLst');

        data.forEach( el => {
            lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, GalleryId: ${el.galleryId}, artistsId: ${el.artistsId}</li>`;        });
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

function validateF(name, galleryId, artistsId){
    if(name.trim() === ''){
        alert('name is not allowed to be empty');
        return 'err';
    }

    if(galleryId.trim() === ''){
        alert('galleryId is not allowed to be empty');
        return 'err';
    }

    if(artistsId.trim() === ''){
        alert('artistsId is not allowed to be empty');
        return 'err';
    }

    if(isNaN(galleryId)){ 
        alert('galleryId must be a number');
        return 'err';
    }

    if(isNaN(artistsId)){ 
        alert('artistsId must be a number');
        return 'err';
    }
    return 'ok';
}


function init(){
    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    
    fetch('http://127.0.0.1:9000/api/artworks', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('artworksLst');

            data.forEach( el => {
                lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, GalleryId: ${el.galleryId}, artistsId: ${el.artistsId}</li>`;
            });
        });

    document.getElementById('btnDelete').addEventListener('click', e => {
        e.preventDefault();

        var id = document.getElementById('delete').value;
        if(validateId(id) === 'err')
            return;
   
        document.getElementById('delete').value = '';
          
        fetch(`http://127.0.0.1:9000/api/artworks/${id}`, {
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
                    const lst = document.getElementById('artworksLst');
                    lst.innerHTML = '';
                    getArtworks(token);
                }         
            })
            .catch(err => alert('id is not allowed to be empty'));
    });

    document.getElementById('btnArtwork').addEventListener('click', e => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('name').value,
            galleryId: document.getElementById('galleryId').value,
            artistsId: document.getElementById('artistId').value, 
        };

        if(validateF(data.name, data.galleryId, data.artistsId) === 'err')
            return;

        document.getElementById('name').value = '';
        document.getElementById('galleryId').value = '';
        document.getElementById('artistId').value = '';

        fetch('http://127.0.0.1:9000/api/artworks', {
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
                    const lst = document.getElementById('artworksLst');
                    lst.innerHTML += `<li>ID: ${el.id}, Name: ${el.name}, GalleryId: ${el.galleryId}, artistsId: ${el.artistsId}</li>`;
                }
            })
    });

    document.getElementById('btnUpdate').addEventListener('click', e => {
        e.preventDefault();
    
        var id = document.getElementById('idUpdate').value;
      
        const data = {
            name: document.getElementById('nameUpdate').value,
            galleryId: document.getElementById('galleryUpdate').value,
            artistsId: document.getElementById('artistUpdate').value, 
        };

        if(validateId(id) === 'err' || validateF(data.name,data.galleryId, data.artistsId) === 'err')
            return;


        document.getElementById('nameUpdate').value = '';
        document.getElementById('galleryUpdate').value = '';
        document.getElementById('artistUpdate').value = '';
    
        document.getElementById('idUpdate').value = '';
        fetch(`http://127.0.0.1:9000/api/artworks/${id}`, {
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
                    const lst = document.getElementById('artworksLst');
                    lst.innerHTML = '';
                    getArtworks(token);
                } 
            })
            .catch(err => alert('Neophodno je uneti id'));
            
    });
}