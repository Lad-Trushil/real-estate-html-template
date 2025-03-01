(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 24,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            }
        }
    });
    
})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
    let services = { women: {}, men: {} }; // Declare services in a broader scope

    function renderServiceCards(services) {
        const container = document.getElementById('services-container');
        if (!container) {
            console.error('Container element not found');
            return;
        }

        // Clear existing content safely
        container.innerHTML = '';

        // Verify services data
        if (!services || !Object.keys(services).length) {
            console.error('Invalid services data');
            return;
        }

        Object.values(services).forEach(serviceCategory => {
            Object.values(serviceCategory).forEach(service => {
                if (service.part_name) {
                    const card = document.createElement('div');
                    card.className = 'col-lg-4 col-md-6 wow fadeInUp';
                    card.innerHTML = `
                        <div class="property-item rounded overflow-hidden">
                            <div class="pricing-card">
                                <img src="./img/new_services/${service.part_name.replace('Beardline', 'Beard Line').replace('Bikini', 'Bikini Area')}.png" alt="${service.part_name}" class="service-image">
                                <div class="add-to-cart-btn">
                                    <button class="btn btn-primary" style="border-radius: 50px;">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                                <div class="service-card-info">
                                    <div class="p-0 pb-0">
                                        <div class="d-flex">
                                            <small class="flex-fill text-center">
                                            <a class="h5 pricing-card-title" href="" data-category="${service.category}">${service.part_name}</a>
                                            </small>
                                            <small class="flex-fill text-center">
                                                <h5 class="mb-0 price">£${service.courseof1 || 0}</h5>
                                            </small>
                                        </div>                                                                                          

                                        <small>Select number of sessions</small>
                                    </div>
                                    <div class="d-flex border-top">
                                        ${service.sessions && service.sessions.length > 0 ? service.sessions.map(session => `
                                            <label class="flex-fill text-center border-end session-label">
                                                <input type="radio" name="sessions" value="${service[`courseof${session.count}`] || 0}" data-category="${service.category}">
                                                <i class="fa fa-chair text-primary"></i>${session.count}
                                            </label>
                                        `).join('') : ''}
                                    </div>
                                </div>                                    
                            </div>                                    
                        </div>
                    `;
                    container.appendChild(card);
                } else {
                    console.error('Service part_name is undefined:', service);
                }
            });
        });
    }

    fetch('pricing.json') // Fetching new pricing data
        .then(response => response.json())
        .then(data => {
            services.women = {
                face: data.women.face,
                body: data.women.body,
                custom_packages: data.women.custom_packages
            };
            services.men = {
                face: data.men.face,
                body: data.men.body,
                custom_packages: data.men.custom_packages
            };

            console.log(services); // Debugging: Log services to check data
            renderServiceCards(services);
        })
        .catch(error => console.error('Error fetching pricing data:', error));

    // Search functionality
    document.getElementById('searchButton')?.addEventListener('click', function () {
        const keyword = document.getElementById('searchKeyword').value.toLowerCase();
        const filteredServices = services.women.concat(services.men).filter(service =>
            service.part_name.toLowerCase().includes(keyword)
        );

        renderServiceCards(filteredServices);
    });
});
