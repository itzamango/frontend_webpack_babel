
import '../SASS/styles.scss'
addEventListener('DOMContentLoaded', () => {
    const btn_menu = document.querySelector('.btn_menu')
    if (btn_menu) {
        btn_menu.addEventListener('click', () => {
            const seccionesNavBar = document.querySelector('secciones-navbar')
            seccionesNavBar.classList.toggle('show')
        })
    }
})


const buscarBar = document.getElementById('search_bar'),
    enviarBtn = document.getElementById('submit_btn'),
    randomBtn = document.getElementById('random_btn'),
    avisoBusqueda = document.getElementById('mensaje-buscar'),
    resultadoPlatillos = document.getElementById('platillos-encontrados'),
    detallesPlatillo = document.getElementById('platillo-seleccionado'),
    divrecomendaciones = document.getElementById('recomendaciones-populares');


// Buscar Platillo API
const buscarPlatillo = event => {
    event.preventDefault();

    // Borra el contenido del platillo antes seleccionado
    detallesPlatillo.innerHTML = '';

    // Contenido de la barra de busqueda
    const busqueda = buscarBar.value;

    // Si no esta vacia la respuesta hace los div con la info de los platillos
    if (busqueda.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                avisoBusqueda.innerHTML = '';
                const headerSearch = document.createElement('h3');
                const headerSearchText = document.createTextNode(`Resultados para: '${busqueda}'`);
                headerSearch.appendChild(headerSearchText);
                avisoBusqueda.appendChild(headerSearch);

                if (data.meals === null) {
                    avisoBusqueda.innerHTML = '';
                    const searchNotFound = document.createTextNode('No se encontraron resultados. Intente usando una sola palabra.');
                    avisoBusqueda.appendChild(searchNotFound)
                    resultadoPlatillos.innerHTML = '';
                } else {
                    resultadoPlatillos.innerHTML = '';
                    data.meals
                        .map(meal => llenarDiv(meal, resultadoPlatillos))
                }
            });
        // Limpia barra de busqueda
        buscarBar.value = '';

    } else {
        buscarBar.placeholder = 'Busca el platillo usando una palabra';
        avisoBusqueda.innerHTML = '';
        const searchText = document.createTextNode('Utilice una palabra para iniciar la búsqueda');
        avisoBusqueda.appendChild(searchText);
        setTimeout(() => {
            avisoBusqueda.innerHTML = '';
        }, 3000);
    }
    resultadoPlatillos.scrollIntoView({ behavior: "smooth" });
};

// Trae la informacion de 8 platillos Random y los agrega
const buscarPlatilloRandom = (e) => {
    resultadoPlatillos.innerHTML = '';
    avisoBusqueda.innerHTML = '';
    const meals = []
    for (let i = 1; i <= 8; i++) {
        fetch("https://www.themealdb.com/api/json/v1/1/random.php")
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                //resultadoPlatillos.innerHTML = meal
                //console.log(meal)
                meals.push(meal)
            })
            .then(data => {
                //console.log(meals);
                resultadoPlatillos.innerHTML = '';
                meals.map(meal => llenarDiv(meal, resultadoPlatillos))
            });

    }
    resultadoPlatillos.scrollIntoView({ behavior: "smooth" });
};


const llenarDiv = function (meal, divALlenar) {
    // Agrega un div que contendra varios elementos
    const divMeal = document.createElement('div');
    divMeal.className = 'meal';
    // Imagen del platillo
    const imgMeal = document.createElement('img');
    imgMeal.src = meal.strMealThumb;
    imgMeal.alt = meal.strMeal;
    imgMeal.id = `img-${meal.idMeal}`;
    // Div donde esta nombre del platillo
    const divMealinfo = document.createElement('div');
    divMealinfo.className = 'meal-info';
    // Encabezado con el nombre del platillo
    const headerMealName = document.createElement('h5');
    headerMealName.id = `nme-${meal.idMeal}`;
    const headerMealNameText = document.createTextNode(`${meal.strMeal}`);
    // Agrega el texto del encabezado al encabezado
    headerMealName.appendChild(headerMealNameText);
    divMealinfo.appendChild(headerMealName);
    // Agrega la imagen y la info con el nombre del platillo al div
    divMeal.appendChild(imgMeal);
    divMeal.appendChild(divMealinfo);
    // Agrega los elementos al div donde se muestran
    divALlenar.appendChild(divMeal);
}

// Trae la informacion del platillo dado su Id y lo agrega
const encontrarPlatilloPorId = idMeal => {
    //console.log('encontrarPlatilloPorId')
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            agregarElemento(meal);
        });
};


// Agrega el elemento al DOM de la pagina
const agregarElemento = meal => {
    const ingredientesArray = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientesArray.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    // Agrega los detalles del platillo como Categoria Area Instrucciones Ingredientes y Video
    detallesPlatillo.innerHTML = `
        <div class="platillo-seleccionado-detalles">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="platillo-seleccionado-cat-area">
                ${meal.strCategory ? `<p>Categoría - ${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>Área - ${meal.strArea}</p>` : ''}
            </div>
            <div class="platillo-seleccionado-instrucciones">
                <h2>Instrucciones:</h2>
                <p>${meal.strInstructions}</p>
                <h2>Ingredientes:</h2>
                <ul>
                    ${ingredientesArray.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
                </ul>
            </div>
            <iframe width="420" height="315"
                    src="//www.youtube.com/embed/${meal.strYoutube.slice(32)}"
                    frameborder="0" allowfullscreen>
            </iframe>
        </div>
    `;
    detallesPlatillo.scrollIntoView({ behavior: "smooth" });
};



const llenarRecomendaciones = (function llenarRecomendacionesPop() {
    divrecomendaciones.innerHTML = '';
    const meals = []
    for (let i = 1; i <= 8; i++) {
        fetch("https://www.themealdb.com/api/json/v1/1/random.php")
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                meals.push(meal)
            })
            .then(data => {
                //console.log(meals);
                divrecomendaciones.innerHTML = ''
                meals.map(meal => llenarDiv(meal, divrecomendaciones))

            });
    }
}());

// Event listener
enviarBtn.addEventListener('submit', buscarPlatillo);

randomBtn.addEventListener('click', buscarPlatilloRandom);

resultadoPlatillos.addEventListener('click', event => {
    if (event.target.getAttribute('id').includes('img-') || event.target.getAttribute('id').includes('nme-')) {
        const idMeal = event.target.getAttribute('id').slice(4);
        encontrarPlatilloPorId(idMeal);
    }
});

divrecomendaciones.addEventListener('click', event => {
    if (event.target.getAttribute('id').includes('img-') || event.target.getAttribute('id').includes('nme-')) {
        const idMeal = event.target.getAttribute('id').slice(4);
        encontrarPlatilloPorId(idMeal);

    }
});