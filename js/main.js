(function ($) {
    "use strict";

    // Include jQuery UI for additional easing functions
    $.getScript("https://code.jquery.com/ui/1.12.1/jquery-ui.min.js", function() {
        console.log("jQuery UI loaded successfully");
    });

    // Spinner
    var spinner = function () {
        requestAnimationFrame(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        });
    };
    spinner();

    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    var debounce = function (func, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        };
    };

 

    $(window).on('scroll', debounce(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }
            }, 100));        
    
    // Back to top button
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav: true,
        navText: [
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
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            }
        }
    });

    fetch('pricing.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })    
        .then(data => {
            // Generate service cards for women (Face) 
            data.women.face.forEach((service, index) => {
                if (service.part_name && service.sessions && service.sessions.length > 0) {
                    var img = new Image();
                    img.src = `./img/new_services/${service.part_name}.png`;
                    img.onload = function() {
                        if (index % 4 === 0) {
                            $('#servicesListMen').append('<div class="row"></div>');
                        }
                        var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        <span class="badge bg-primary" style="position: absolute; top: 10px; right: 10px;">Face</span>
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image">
                                        <div class="add-to-cart-btn">
                                            <button class="btn btn-primary" style="border-radius: 50px;">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="d-flex">
                                                    <small class="flex-fill text-center"><a class="h5 pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><h5 class="mb-0" id="price">£${service.sessions[0].price}</h5></small>
                                                </div>
                                                <small>Select number of sessions</small>
                                            </div>
                                            <div class="d-flex border-top">
                                                ${service.sessions.map(session => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;">
                                                        <i class="fa fa-chair text-primary"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $('#servicesListWomen .row').last().append(serviceCard);
                    };
                }
            });
            // Generate service cards for men (Face) 
            data.men.face.forEach((service, index) => {
                if (service.part_name && service.sessions && service.sessions.length > 0) {
                    var img = new Image();
                    img.src = `./img/new_services/${service.part_name}.png`;
                    img.onload = function() {
                        if (index % 4 === 0) {
                            $('#servicesListMen').append('<div class="row"></div>');
                        }
                        var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        <span class="badge bg-primary" style="position: absolute; top: 10px; right: 10px;">Face</span>
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image">
                                        <div class="add-to-cart-btn">
                                            <button class="btn btn-primary" style="border-radius: 50px;">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="d-flex">
                                                    <small class="flex-fill text-center"><a class="h5 pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><h5 class="mb-0" id="price">£${service.sessions[0].price}</h5></small>
                                                </div>
                                                <small>Select number of sessions</small>
                                            </div>
                                            <div class="d-flex border-top">
                                                ${service.sessions.map(session => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;">
                                                        <i class="fa fa-chair text-primary"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $('#servicesListMen .row').last().append(serviceCard);
                    };
                }
            });

            // Generate service cards for body (Women) 
            data.women.body.forEach((service, index) => {
                if (service.part_name && service.sessions && service.sessions.length > 0) {
                    var img = new Image();
                    img.src = `./img/new_services/${service.part_name}.png`;
                    img.onload = function() {
                        if (index % 4 === 0) {
                            $('#servicesListWomen').append('<div class="row"></div>');
                        }
                        var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        <span class="badge bg-primary" style="position: absolute; top: 10px; right: 10px;">Body</span>
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image">
                                        <div class="add-to-cart-btn">
                                            <button class="btn btn-primary" style="border-radius: 50px;">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="d-flex">
                                                    <small class="flex-fill text-center"><a class="h5 pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><h5 class="mb-0" id="price">£${service.sessions[0].price}</h5></small>
                                                </div>
                                                <small>Select number of sessions</small>
                                            </div>
                                            <div class="d-flex border-top">
                                                ${service.sessions.map(session => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;">
                                                        <i class="fa fa-chair text-primary"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $('#servicesListWomen .row').last().append(serviceCard);
                    };
                }
            });

            // Generate service cards for body (Men) 
            data.men.body.forEach((service, index) => {
                if (service.part_name && service.sessions && service.sessions.length > 0) {
                    var img = new Image();
                    img.src = `./img/new_services/${service.part_name}.png`;
                    img.onload = function() {
                        if (index % 4 === 0) {
                            $('#servicesListMen').append('<div class="row"></div>');
                        }
                        var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        <span class="badge bg-primary" style="position: absolute; top: 10px; right: 10px;">Body</span>
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image">
                                        <div class="add-to-cart-btn">
                                            <button class="btn btn-primary" style="border-radius: 50px;">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="d-flex">
                                                    <small class="flex-fill text-center"><a class="h5 pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><h5 class="mb-0" id="price">£${service.sessions[0].price}</h5></small>
                                                </div>
                                                <small>Select number of sessions</small>
                                            </div>
                                            <div class="d-flex border-top">
                                                ${service.sessions.map(session => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;">
                                                        <i class="fa fa-chair text-primary"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $('#servicesListMen .row').last().append(serviceCard);
                    };
                }
            });

            // Generate service cards for custom packages (Women) 
            data.women.custom_packages.forEach((service, index) => {
                if (service.part_name && service.sessions && service.sessions.length > 0) {
                    var img = new Image();
                    img.src = `./img/new_services/${service.part_name}.png`;
                    img.onload = function() {
                        if (index % 4 === 0) {
                            $('#servicesListWomen').append('<div class="row"></div>');
                        }
                        var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        <span class="badge bg-primary" style="position: absolute; top: 10px; right: 10px;">Custom Package</span>
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image">
                                        <div class="add-to-cart-btn">
                                            <button class="btn btn-primary" style="border-radius: 50px;">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="d-flex">
                                                    <small class="flex-fill text-center"><a class="h5 pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><h5 class="mb-0" id="price">£${service.sessions[0].price}</h5></small>
                                                </div>
                                                <small>Select number of sessions</small>
                                            </div>
                                            <div class="d-flex border-top">
                                                ${service.sessions.map(session => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;">
                                                        <i class="fa fa-chair text-primary"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $('#servicesListWomen .row').last().append(serviceCard);
                    };
                }
            });

            // Generate service cards for custom packages (Men) 
            data.men.custom_packages.forEach((service, index) => {
                if (service.part_name && service.sessions && service.sessions.length > 0) {
                    var img = new Image();
                    img.src = `./img/new_services/${service.part_name}.png`;
                    img.onload = function() {
                        if (index % 4 === 0) {
                            $('#servicesListMen').append('<div class="row"></div>');
                        }
                        var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        <span class="badge bg-primary" style="position: absolute; top: 10px; right: 10px;">Custom Package</span>
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image">
                                        <div class="add-to-cart-btn">
                                            <button class="btn btn-primary" style="border-radius: 50px;">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="d-flex">
                                                    <small class="flex-fill text-center"><a class="h5 pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><h5 class="mb-0" id="price">£${service.sessions[0].price}</h5></small>
                                                </div>
                                                <small>Select number of sessions</small>
                                            </div>
                                            <div class="d-flex border-top">
                                                ${service.sessions.map(session => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;">
                                                        <i class="fa fa-chair text-primary"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $('#servicesListMen .row').last().append(serviceCard);
                    };
                }
            });

            // Add event listeners to radio buttons after the service cards are appended
            $('#servicesListWomen, #servicesListMen').on('change', 'input[type="radio"]', function() {
                // Remove styles from all radio button parents within the same card
                const serviceCard = this.closest('.property-item');
                serviceCard.querySelectorAll(`input[name="${this.name}"]`).forEach((el) => {
                    el.parentElement.classList.remove('bg-dark', 'text-white');
                });

                // Add styles to the selected radio button's parent
                this.parentElement.classList.add('bg-dark', 'text-white');

                // Update the price display within the same card
                serviceCard.querySelector('#price').innerText = '£' + this.value;

                // Perform any additional changes to the serviceCard if needed
                serviceCard.classList.add('highlight'); // Example class for highlighting
            });

        })
        .catch(error => {
            console.error('Error fetching pricing data:', error);
            // Handle the error gracefully, e.g., show a message or use fallback data
        });
})(jQuery);
