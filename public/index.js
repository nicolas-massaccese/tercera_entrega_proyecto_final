
let input = document.getElementById('phone');
window.intlTelInput(input,{});

async function getData(url) {
    try {
    const response = await fetch(url);
    
    const responseData = await response.json();
    let htmlString = '';
    responseData.forEach(products => {
        // desestructurando cada producto
        const {_id, foto, nombre, descripcion, tamanio, precio} = products

        htmlString +=`<article class="cardBox">
                                    <figure class="fotoProducto">
                                        <img src="../uploads/avatar.jpeg" alt="">
                                    </figure>
                                    <div class="encabezado">
                                        <h4 class="modelo">${nombre}</h4>
                                    </div>
                                

                                    <div class="caracteristicas">
                                        <p class="tipo">${descripcion}</p>
                                        <div class="barra"></div>
                                        <p class="medida">${stock}</p>
                                    </div>
                                    <p class="precio">${precio}</p>
                                    <button class="addProduct">Agregar a carrito</button>
                                </article>`
    });
    document.getElementById('productList').innerHTML = htmlString
    console.log(htmlString);
    } catch (error) {
    console.error(error);
    }
};

getData('/profile')


