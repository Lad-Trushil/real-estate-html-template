(function ($) {
    "use strict";

    // Include jQuery UI for additional easing functions
    $.getScript("https://code.jquery.com/ui/1.12.1/jquery-ui.min.js", function () {
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

        // Hero slider
        var currentSlide = 0;
        var slides = $('.hero-slide');
        var totalSlides = slides.length;
    
        function showSlide(index) {
            slides.removeClass('active');
            slides.eq(index).addClass('active');
        }
    
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }
    
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    

    // Show the popup after a delay
    setTimeout(function () {
        $('#subscribeModal').modal('show');
    }, 2000); // Show after 2 seconds

    // Handle form submission
    $('#subscribeForm').on('submit', function (e) {
        e.preventDefault();
        var data = $(this).serialize();
        var action = $(this).attr('action');
        $.post(action, data, function () {
            $('#subscribeForm')[0].reset();
            $('#success_msg').show();
            setTimeout(function () {
                $('#subscribeModal').modal('hide');
                $('#success_msg').hide();
            }, 3000); // Hide after 3 seconds
        });
    });

    
    $('#subscribeButton').on('click', function() {
        var email = $('#subscriptionEmail').val();
        if (email) {
            $.ajax({
                url: 'https://script.google.com/macros/s/AKfycbx2SC1iO10PZPD73v4edjEQKh8-G5mX4GohUEuAdZfYMJ6_Fru3_YXMZ1s6EmZBqAvMDA/exec',
                method: 'POST',
                data: {
                    email: email
                },
                success: function(response) {
                    alert('Thank you for subscribing!');
                    $('#subscriptionEmail').val(''); // Clear the input field
                },
                error: function(error) {
                    alert('There was an error. Please try again.');
                }
            });
        } else {
            alert('Please enter a valid email address.');
        }
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

    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    if (currentPage === 'laser-pricing-women') {
        fetch('https://script.google.com/macros/s/AKfycbxh6vIW-Ez9qfok-nGUwn5jPyfPQRpfNmrcWt0zSi17KkX9lsWshdAaxPe0s9wP68vYnw/exec?action=pricing')
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
                        img.src = `./img/women_services/women_${service.part_name}.png`;
                        img.onload = function () {
                            var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        
                                        <img src="${img.src}" alt="${service.part_name}" loading="lazy" class="service-image mb-5">
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="flex-fill text-end add-to-cart-btn">
                                                    <button class="btn btn-primary m-0 p-1" style="border-radius: 50px; font-size: 12px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>                                                    
                                                </div>   
                                                <div class="d-flex glass-effect">
                                                    <small class="flex-fill text-center"><a class="pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><p class="pricing-card-price mb-0" id="price">£${service.sessions[0].price}</p></small>
                                                </div>                 
                                                <div class="d-flex glass-effect p-1">
                                                <small style="font-size:11px;">Select number of sessions</small>
                                                </div>                                                         
                                            <div class="d-flex border-top">                                            
                                                ${service.sessions.map((session, index) => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label ${index === 0 ? 'bg-primary text-white selected' : ''}" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;" ${index === 0 ? 'checked' : ''}>
                                                        <i class="fa fa-chair"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            $('#servicesListWomenFace').last().append(serviceCard);
                        };
                    }
                });

                // Generate service cards for women (Upper Body) 
                data.women.upperbody.forEach((service, index) => {
                    if (service.part_name && service.sessions && service.sessions.length > 0) {
                        var img = new Image();
                        img.src = `./img/women_services/women_${service.part_name}.png`;
                        img.onload = function () {
                            // if (index % 4 === 0) {
                            //     $('#servicesListWomen').append('<div class="row"></div>');
                            // }
                            var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        
                                        <img src="${img.src}" alt="${service.part_name}" loading="lazy" class="service-image mb-5">
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="flex-fill text-end add-to-cart-btn">
                                                    <button class="btn btn-primary m-0 p-1" style="border-radius: 50px; font-size: 12px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>                                                    
                                                </div>   
                                                <div class="d-flex glass-effect">
                                                    <small class="flex-fill text-center"><a class="pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><p class="pricing-card-price mb-0" id="price">£${service.sessions[0].price}</p></small>
                                                </div>                 
                                                <div class="d-flex glass-effect p-1">
                                                <small style="font-size:11px;">Select number of sessions</small>
                                                </div>                                                         
                                            <div class="d-flex border-top">                                            
                                                ${service.sessions.map((session, index) => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label ${index === 0 ? 'bg-primary text-white selected' : ''}" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;" ${index === 0 ? 'checked' : ''}>
                                                        <i class="fa fa-chair"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            $('#servicesListWomenUpperBody').last().append(serviceCard);
                        };
                    }
                });

                // Generate service cards for women (Lower Body) 
                data.women.lowerbody.forEach((service, index) => {
                    if (service.part_name && service.sessions && service.sessions.length > 0) {
                        var img = new Image();
                        img.src = `./img/women_services/women_${service.part_name}.png`;
                        img.onload = function () {
                            var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        
                                        <img src="${img.src}" alt="${service.part_name}" loading="lazy" class="service-image mb-5">
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="flex-fill text-end add-to-cart-btn">
                                                    <button class="btn btn-primary m-0 p-1" style="border-radius: 50px; font-size: 12px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>                                                    
                                                </div>   
                                                <div class="d-flex glass-effect">
                                                    <small class="flex-fill text-center"><a class="pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><p class="pricing-card-price mb-0" id="price">£${service.sessions[0].price}</p></small>
                                                </div>                 
                                                <div class="d-flex glass-effect p-1">
                                                <small style="font-size:11px;">Select number of sessions</small>
                                                </div>                                                         
                                            <div class="d-flex border-top">                                            
                                                ${service.sessions.map((session, index) => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label ${index === 0 ? 'bg-primary text-white selected' : ''}" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;" ${index === 0 ? 'checked' : ''}>
                                                        <i class="fa fa-chair"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            $('#servicesListWomenLowerBody').last().append(serviceCard);
                        };
                    }
                });

                // Generate service cards for women (Custom packages) 
                data.women.custom_packages.forEach((service, index) => {
                    if (service.part_name && service.sessions && service.sessions.length > 0) {
                        var img = new Image();
                        img.src = `./img/women_services/women_${service.part_name}.png`;
                        img.onload = function () {
                            // if (index % 4 === 0) {
                            //     $('#servicesListWomen').append('<div class="row"></div>');
                            // }
                            var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        
                                        <img src="${img.src}" alt="${service.part_name}" loading="lazy" class="service-image mb-5">
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="flex-fill text-end add-to-cart-btn">
                                                    <button class="btn btn-primary m-0 p-1" style="border-radius: 50px; font-size: 12px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>                                                    
                                                </div>   
                                                <div class="d-flex glass-effect">
                                                    <small class="flex-fill text-center"><a class="pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><p class="pricing-card-price mb-0" id="price">£${service.sessions[0].price}</p></small>
                                                </div>                 
                                                <div class="d-flex glass-effect p-1">
                                                <small style="font-size:11px;">Select number of sessions</small>
                                                </div>                                                         
                                            <div class="d-flex border-top">                                            
                                                ${service.sessions.map((session, index) => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label ${index === 0 ? 'bg-primary text-white selected' : ''}" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;" ${index === 0 ? 'checked' : ''}>
                                                        <i class="fa fa-chair"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            $('#servicesListWomenCustomPackages').last().append(serviceCard);
                        };
                    }
                });

                 // Add event listeners to radio buttons after the service cards are appended
                $('#servicesListWomenFace, #servicesListWomenUpperBody, #servicesListWomenLowerBody, #servicesListWomenCustomPackages').on('change', 'input[type="radio"]', function () {
                    // Find the closest service card
                    const serviceCard = $(this).closest('.property-item');
                
                    // Remove styles from all radio button parents within the same card
                    serviceCard.find(`input[name="${this.name}"]`).each(function () {
                        $(this).parent().removeClass('bg-primary text-white selected');
                    });
                
                    // Add styles to the selected radio button's parent
                    $(this).parent().addClass('bg-primary text-white selected');
                
                    // Update the price display within the same card
                    const selectedPrice = $(this).val();
                    serviceCard.find(`#price`).text('£' + selectedPrice);
                
                    // Optional: Add any additional changes to the serviceCard if needed
                    serviceCard.addClass('highlight'); // Example class for highlighting
                });

                // Attach event listener to Add to Cart buttons
                $(document).on('click', '.add-to-cart-btn button', handleAddToCartClick);


            })
            .catch(error => {
                console.error('Error fetching pricing data:', error);
                // Handle the error gracefully, e.g., show a message or use fallback data
            });
    }else if (currentPage === 'laser-pricing-men') {
        fetch('https://script.google.com/macros/s/AKfycbxh6vIW-Ez9qfok-nGUwn5jPyfPQRpfNmrcWt0zSi17KkX9lsWshdAaxPe0s9wP68vYnw/exec?action=pricing')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                // Generate service cards for men (Face) 
                data.men.face.forEach((service, index) => {
                    if (service.part_name && service.sessions && service.sessions.length > 0) {
                        var img = new Image();
                        img.src = `./img/men_services/men_${service.part_name}.png`;
                        img.onload = function () {
                            var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image mb-5">
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="flex-fill text-end add-to-cart-btn">
                                                    <button class="btn btn-primary m-0 p-1" style="border-radius: 50px; font-size: 12px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>                                                    
                                                </div>   
                                                <div class="d-flex glass-effect">
                                                    <small class="flex-fill text-center"><a class="pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><p class="pricing-card-price mb-0" id="price">£${service.sessions[0].price}</p></small>
                                                </div>                 
                                                <div class="d-flex glass-effect p-1">
                                                <small style="font-size:11px;">Select number of sessions</small>
                                                </div>                                                         
                                            <div class="d-flex border-top">                                            
                                                ${service.sessions.map((session, index) => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label ${index === 0 ? 'bg-primary text-white selected' : ''}" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;" ${index === 0 ? 'checked' : ''}>
                                                        <i class="fa fa-chair"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            $('#servicesListMenFace').last().append(serviceCard);
                        };
                    }
                });

                // Generate service cards for men (Upper Body) 
                data.men.upperbody.forEach((service, index) => {
                    if (service.part_name && service.sessions && service.sessions.length > 0) {
                        var img = new Image();
                        img.src = `./img/men_services/men_${service.part_name}.png`;
                        img.onload = function () {
                            var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image mb-5">
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="flex-fill text-end add-to-cart-btn">
                                                    <button class="btn btn-primary m-0 p-1" style="border-radius: 50px; font-size: 12px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>                                                    
                                                </div>   
                                                <div class="d-flex glass-effect">
                                                    <small class="flex-fill text-center"><a class="pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><p class="pricing-card-price mb-0" id="price">£${service.sessions[0].price}</p></small>
                                                </div>                 
                                                <div class="d-flex glass-effect p-1">
                                                <small style="font-size:11px;">Select number of sessions</small>
                                                </div>                                                         
                                            <div class="d-flex border-top">                                            
                                                ${service.sessions.map((session, index) => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label ${index === 0 ? 'bg-primary text-white selected' : ''}" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;" ${index === 0 ? 'checked' : ''}>
                                                        <i class="fa fa-chair"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            $('#servicesListMenUpperBody').last().append(serviceCard);
                        };
                    }
                });

                // Generate service cards for men (Lower Body) 
                data.men.lowerbody.forEach((service, index) => {
                    if (service.part_name && service.sessions && service.sessions.length > 0) {
                        var img = new Image();
                        img.src = `./img/men_services/men_${service.part_name}.png`;
                        img.onload = function () {
                            // if (index % 4 === 0) {
                            //     $('#servicesListWomen').append('<div class="row"></div>');
                            // }
                            var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image mb-5">
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="flex-fill text-end add-to-cart-btn">
                                                    <button class="btn btn-primary m-0 p-1" style="border-radius: 50px; font-size: 12px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>                                                    
                                                </div>   
                                                <div class="d-flex glass-effect">
                                                    <small class="flex-fill text-center"><a class="pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><p class="pricing-card-price mb-0" id="price">£${service.sessions[0].price}</p></small>
                                                </div>                 
                                                <div class="d-flex glass-effect p-1">
                                                <small style="font-size:11px;">Select number of sessions</small>
                                                </div>                                                         
                                            <div class="d-flex border-top">                                            
                                                ${service.sessions.map((session, index) => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label ${index === 0 ? 'bg-primary text-white selected' : ''}" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;" ${index === 0 ? 'checked' : ''}>
                                                        <i class="fa fa-chair"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            $('#servicesListMenLowerBody').last().append(serviceCard);
                        };
                    }
                });

                // Generate service cards for men (Custom packages) 
                data.men.custom_packages.forEach((service, index) => {
                    if (service.part_name && service.sessions && service.sessions.length > 0) {
                        var img = new Image();
                        img.src = `./img/men_services/men_${service.part_name}.png`;
                        img.onload = function () {
                            var serviceCard = `
                            <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="pricing-card">
                                        
                                        <img src="${img.src}" alt="${service.part_name}" class="service-image mb-5">
                                        <div class="service-card-info">
                                            <div class="p-0 pb-0">
                                                <div class="flex-fill text-end add-to-cart-btn">
                                                    <button class="btn btn-primary m-0 p-1" style="border-radius: 50px; font-size: 12px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>                                                    
                                                </div>   
                                                <div class="d-flex glass-effect">
                                                    <small class="flex-fill text-center"><a class="pricing-card-title" href="">${service.part_name}</a></small>
                                                    <small class="flex-fill text-center"><p class="pricing-card-price mb-0" id="price">£${service.sessions[0].price}</p></small>
                                                </div>                 
                                                <div class="d-flex glass-effect p-1">
                                                <small style="font-size:11px;">Select number of sessions</small>
                                                </div>                                                         
                                            <div class="d-flex border-top">                                            
                                                ${service.sessions.map((session, index) => `
                                                    ${session.price !== undefined && session.session !== undefined ? `
                                                    <label class="flex-fill text-center border-end session-label ${index === 0 ? 'bg-primary text-white selected' : ''}" style="cursor: pointer;" for="${service.part_name}-${session.price}">
                                                        <input type="radio" id="${service.part_name}-${session.price}" name="${service.part_name}" value="${session.price}" style="display: none;" ${index === 0 ? 'checked' : ''}>
                                                        <i class="fa fa-chair"></i>${session.session}
                                                    </label>
                                                    ` : ''}
                                                `).join('')}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            $('#servicesListMenCustomPackages').last().append(serviceCard);
                        };
                    }
                });

                 // Add event listeners to radio buttons after the service cards are appended
                $('#servicesListMenFace, #servicesListMenUpperBody, #servicesListMenLowerBody, #servicesListMenCustomPackages').on('change', 'input[type="radio"]', function () {
                    // Find the closest service card
                    const serviceCard = $(this).closest('.property-item');
                
                    // Remove styles from all radio button parents within the same card
                    serviceCard.find(`input[name="${this.name}"]`).each(function () {
                        $(this).parent().removeClass('bg-primary text-white selected');
                    });
                
                    // Add styles to the selected radio button's parent
                    $(this).parent().addClass('bg-primary text-white selected');
                
                    // Update the price display within the same card
                    const selectedPrice = $(this).val();
                    serviceCard.find(`#price`).text('£' + selectedPrice);
                
                    // Optional: Add any additional changes to the serviceCard if needed
                    serviceCard.addClass('highlight'); // Example class for highlighting
                });


                // Attach event listener to Add to Cart buttons
                $(document).on('click', '.add-to-cart-btn button', handleAddToCartClick);
            })
            .catch(error => {
                console.error('Error fetching pricing data:', error);
                // Handle the error gracefully, e.g., show a message or use fallback data
            });
    } else if (currentPage === 'shop') {
        console.log('shop page');
        fetch('https://script.google.com/macros/s/AKfycbxh6vIW-Ez9qfok-nGUwn5jPyfPQRpfNmrcWt0zSi17KkX9lsWshdAaxPe0s9wP68vYnw/exec?action=shop')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Generate cards for products 
                data.products.forEach((product, index) => {
                    if (product.id) {
                        var img = new Image();
                        img.src = `./img/ProductsVouchers/${product.image}`;
                        img.onload = function () {
                            // Inside the fetch then block for products and vouchers
                            var productsCard = `
                            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="card shadow pricing-card p-1">
                                        <img src="${img.src}" alt="${product.name}" loading="lazy" class="service-image mb-5">
                                        ${product.name.includes('Exfoliating Mitt') ? '<span class="badge bg-primary" style="position: absolute; top: 10px; left: 10px;">Buy 3 for £12</span>' : ''}
                                        <div class="service-card-info" style="position: relative;">
                                            <div class="p-0 pb-0">
                                                <div class="d-flex">
                                                    <small class="flex-fill"><h6 class="pricing-card-title" href="">${product.name}</h6></small>
                                                    <small class="flex-fill"><h6 class="mb-2 pricing-card-price" id="price" data-price="${product.price}">£${product.price}</h6></small>                                                    
                                                </div> 
                                                <div class="add-to-cart-btn my-2">
                                                    <button class="btn btn-primary" style="border-radius: 50px; font-size: 15px;">
                                                        <i class="fa fa-plus"></i> Add to Cart
                                                    </button>
                                                </div>                                               
                                                <p class="description" style="text-align: left;">
                                                    ${product.description}
                                                </p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>`;
                            $('#productsList').last().append(productsCard);
                        };
                    }
                });

                // Generate cards for voucher 
                data.vouchers.forEach((product, index) => {
                    if (product.id) {
                        var img = new Image();
                        img.src = `./img/ProductsVouchers/${product.image}`;
                        img.onload = function () {
                            // Inside the fetch then block for products and vouchers
                            var productsCard = `
                            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="property-item rounded overflow-hidden">
                                    <div class="card shadow pricing-card p-1">
                                        <img src="${img.src}" alt="${product.name}" loading="lazy" class="service-image mb-5">
                                        ${product.name.includes('Exfoliating Mitt') ? '<span class="badge bg-primary" style="position: absolute; top: 10px; left: 10px;">Buy 3 for £12</span>' : ''}
                                        <div class="service-card-info" style="position: relative;">
                                            <div class="p-0 pb-0">
                                                <div class="d-flex">
                                                    <small class="flex-fill"><h6 class="pricing-card-title" href="">${product.name}</h6></small>
                                                    <small class="flex-fill"><h6 class="mb-2 pricing-card-price" id="price" data-price="${product.price}">£${product.price}</h6></small>                                                    
                                                </div> 
                                                <div class="add-to-cart-btn my-2">
                                                            <button class="btn btn-primary" style="border-radius: 50px; font-size: 15px;">
                                                                <i class="fa fa-plus"></i> Add to Cart
                                                            </button>
                                                </div>                                               
                                                <p class="description" style="text-align: left;">
                                                    ${product.description}
                                                </p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>`;
                            $('#vouchersList').last().append(productsCard);
                        };
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching pricing data:', error);
                // Handle the error gracefully, e.g., show a message or use fallback data
            });

        function initializeQuantityControls() {
            $(document).on('click', '.plus-btn', function () {
                var quantityInput = $(this).siblings('input[name="quantity"]');
                var priceElement = $(this).closest('.service-card-info').find('#price1');
                var productPrice = parseFloat(priceElement.data('price'));
                quantityInput.val(parseInt(quantityInput.val()) + 1);
                priceElement.text('£' + (productPrice * quantityInput.val()).toFixed(2));
            });

            $(document).on('click', '.minus-btn', function () {
                var quantityInput = $(this).siblings('input[name="quantity"]');
                var priceElement = $(this).closest('.service-card-info').find('#price1');
                var productPrice = parseFloat(priceElement.data('price'));
                if (quantityInput.val() > 1) {
                    quantityInput.val(parseInt(quantityInput.val()) - 1);
                    priceElement.text('£' + (productPrice * quantityInput.val()).toFixed(2));
                }
            });

            $(document).on('change', 'input[name="quantity"]', function () {
                var quantityInput = $(this);
                var priceElement = $(this).closest('.service-card-info').find('#price1');
                var productPrice = parseFloat(priceElement.data('price'));
                if (quantityInput.val() < 1) {
                    quantityInput.val(1);
                }
                priceElement.text('£' + (productPrice * quantityInput.val()).toFixed(2));
            });
        }
        // Call the function after the products and vouchers are loaded
        initializeQuantityControls();
        // ...existing code...

        // Attach event listener to Add to Cart buttons for products and vouchers
        $(document).on('click', '.add-to-cart-btn button', handleAddToCartClick);

    } else if (currentPage === 'faqs') {    
        fetch('https://script.google.com/macros/s/AKfycbxh6vIW-Ez9qfok-nGUwn5jPyfPQRpfNmrcWt0zSi17KkX9lsWshdAaxPe0s9wP68vYnw/exec?action=faqs')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Generate cards for products 
                data.forEach((faq, index) => {
                    if (faq.answer && faq.question) {
                        // Inside the fetch then block for faqs
                        var faqsCard = `
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="heading${index}">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                        ${faq.question}
                                    </button>
                                </h2>
                                <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#faqAccordion">
                                    <div class="accordion-body">
                                        ${faq.answer}
                                    </div>
                                </div>
                            </div>
                        `;
                        $('#faqsList').last().append(faqsCard);                        
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching faqs data:', error);
                // Handle the error gracefully, e.g., show a message or use fallback data
            });
    } else if (currentPage === '') {
        const $carouselInner = $('#servicesCarouselInner');
        const $prevButton = $('.services-carousel-prev');
        const $nextButton = $('.services-carousel-next');

        const scrollStep = 300; // Adjust this value based on your card width

        $prevButton.on('click', function () {
            $carouselInner.animate({
                scrollLeft: '-=' + scrollStep
            }, 'smooth');
        });

        $nextButton.on('click', function () {
            $carouselInner.animate({
                scrollLeft: '+=' + scrollStep
            }, 'smooth');
        });
    } else if (currentPage === 'blog') {
        fetch('https://script.google.com/macros/s/AKfycbxh6vIW-Ez9qfok-nGUwn5jPyfPQRpfNmrcWt0zSi17KkX9lsWshdAaxPe0s9wP68vYnw/exec?action=blog')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Generate cards for products 
                data.forEach((blog, index) => {
                    if (blog.title) {
                        // Inside the fetch then block for faqs
                        var blogCard = `
                            <div class="col-md-4">
                                <div class="card">
                                    <a data-bs-toggle="modal" data-bs-target="#blogModal${index}">
                                        <img src="${blog.image}"  loading="lazy" class="card-img-top" alt="${blog.image}">
                                        <div class="card-body">
                                            <h5 class="card-title">${blog.title}</h5>
                                            <p class="card-text">${blog.short_description}...<a data-bs-toggle="modal" data-bs-target="#blogModal${index}">Read More</a></p>                                            
                                        </div>
                                    </a>
                                </div>
                            </div>

                             <div class="modal fade" id="blogModal${index}" tabindex="-1" aria-labelledby="blogModalLabel${index}" aria-hidden="true">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="blogModalLabel${index}">${blog.title}</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <p>${blog.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        $('#blogList').last().append(blogCard);                        
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching faqs data:', error);
                // Handle the error gracefully, e.g., show a message or use fallback data
            });
    }

    // Cart object to store cart items
    const cart = [];

    // Function to update the cart display
    function updateCartDisplay() {
        const cartContainer = $('#cartItems');
        cartContainer.empty();

        if (cart.length === 0) {
            cartContainer.append('<p>Your cart is empty.</p>');
            return;
        }

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            var cartItem;
            const currentPage = window.location.pathname.split('/').pop().split('.')[0];
        if (currentPage === 'laser-pricing-men' || currentPage === 'laser-pricing-women') {
            cartItem = `
                        <div class="cart-item col-12 d-flex justify-content-between align-items-center">
                            <p>${item.name} - £${item.price} x                         
                                <select name="quantity" class="quantity-input" data-index="${index}" style="width: 60px; text-align: center;">
                                    <option value="1" ${item.quantity == 1 ? 'selected' : ''}>1</option>
                                    <option value="3" ${item.quantity == 3 ? 'selected' : ''}>3</option>
                                    <option value="6" ${item.quantity == 6 ? 'selected' : ''}>6</option>
                                    <option value="8" ${item.quantity == 8 ? 'selected' : ''}>8</option>
                                </select>                        
                                
                                = £${subtotal.toFixed(2)}
            
                                <button class="btn text-danger btn-sm" style="border:1px red dotted;border-radius:50px;" onclick="removeFromCart(${index})">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </p>
                        </div>
                    `;
     }else{
            cartItem = `
                <div class="cart-item col-12 d-flex justify-content-between align-items-center">
                    <p>${item.name} - £${item.price} x                         
                        <input type="number" name="quantity" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}" style="width: 50px; text-align: center;">                        
                        
                        = £${subtotal.toFixed(2)}

                        <button class="btn text-danger btn-sm" style="border:1px red dotted;border-radius:50px;" onclick="removeFromCart(${index})">
                            <i class="fa fa-minus"></i>
                        </button>
                    </p>
                </div>
            `;
        }            
            cartContainer.append(cartItem);
        });

        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Apply discount for Exfoliating Mitts
        const mitts = cart.filter(item => item.name.includes('Exfoliating Mitt'));
        const mittCount = mitts.reduce((sum, item) => sum + item.quantity, 0);
        if (mittCount >= 3) {
            const discount = Math.floor(mittCount / 3) * (mitts[0].price * 3 - 12);
            total -= discount;
            cartContainer.append(`<p class="text-primary">Exfoliating Mitt Discount: -£${discount.toFixed(2)}</p>`);
        }

        // Display subtotal before packaging
        const subtotalBeforePackaging = total;

        // Add this condition to exclude laser-pricing-men and laser-pricing-women pages
        if (currentPage !== 'laser-pricing-men' && currentPage !== 'laser-pricing-women') {
            cartContainer.append(`<p>Subtotal before Packaging: £${subtotalBeforePackaging.toFixed(2)}</p>`);
        }

        // Apply Parcel & Packaging Charge for products on the shop page
        if (currentPage === 'shop' && cart.some(item => item.type === 'product')) {
            total += 3.5;
            cartContainer.append(`<p>Parcel & Packaging Charge: £3.50</p>`);
        }

        // Display final total
        cartContainer.append(`<h5>Total: £${total.toFixed(2)}</h5>`);

        updateCartItemCount(cart.length);
        initializePayPalButtons();
    }

    // Function to update the quantity of an item in the cart
    function updateCartQuantity(index, change) {
        const item = cart[index];
        item.quantity += change;
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        updateCartDisplay();
    }

    // Attach event listener to quantity input fields
    $(document).on('change', '.quantity-input', function () {
        const index = $(this).data('index');
        const newQuantity = parseInt($(this).val());
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            updateCartDisplay();
        } else {
            $(this).val(cart[index].quantity);
        }
    });

    // Example function to update the cart item count
    function updateCartItemCount(count) {
        document.getElementById('cartItemCountNumber').textContent = count;
    }


    // Function to handle Add to Cart button click
    function handleAddToCartClick(event) {
        const button = $(event.target).closest('button'); // The button that was clicked
        const serviceCard = $(event.target).closest('.property-item');
        const serviceName = serviceCard.find('.pricing-card-title').text();        
        const itemType = serviceCard.closest('#productsList').length ? 'product' : 'voucher';
    
        var selectedSession = serviceCard.find('input[type="radio"]:checked').val();
        if (!selectedSession) {
            // Select the first radio button if none is selected
            var firstRadioButton = serviceCard.find('input[type="radio"]').first();
            firstRadioButton.prop('checked', true);
            selectedSession = firstRadioButton.closest('label').text().trim(); // Get the label text as the session number
        }
        
        // Map the session values based on the selected radio button
        const sessionValues = [1, 3, 6, 8]; // Define the session values
        const selectedIndex = serviceCard.find('input[type="radio"]').index(serviceCard.find('input[type="radio"]:checked'));
        selectedSession = sessionValues[selectedIndex] || 1; // Default to 1 if no valid index is found
    
        // Determine the quantity based on the session value for laser-pricing-men and laser-pricing-women
        const currentPage = window.location.pathname.split('/').pop().split('.')[0];
        let quantity = 1; // Default quantity
        var servicePrice;
        if (currentPage === 'laser-pricing-men' || currentPage === 'laser-pricing-women') {
            quantity = parseInt(selectedSession) || 1; // Use session value as quantity
            servicePrice = serviceCard.find('input[type="radio"]').first().val(); // Get the price from the first radio button
        }else{
            servicePrice = parseFloat(serviceCard.find('#price').text().replace('£', ''));
        }
    
        const existingItemIndex = cart.findIndex(item => item.name === serviceName && item.session === selectedSession);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                name: serviceName,
                price: servicePrice,
                session: selectedSession,
                quantity: quantity,
                type: itemType
            });
        }
    
        updateCartDisplay();
    
        // Change button text and add animation class
        button.text('Added!').addClass('added-to-cart');
    
        // Revert button text and remove animation class after animation completes
        setTimeout(() => {
            button.text('').append('<i class="fa fa-plus"></i> Add to Cart').removeClass('added-to-cart');
        }, 1000); // Duration of the animation
    }

    // Function to remove item from cart
    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        updateCartDisplay();
    };

    // Initial cart display
    updateCartDisplay();

    // Initialize the first step as active
    $('#cartStep1').addClass('active');

    function initializePayPalButtons() {
        const paypalButtonContainer = document.getElementById('paypal-button-container');
        paypalButtonContainer.innerHTML = '';
        paypal.Buttons({
            createOrder: function (data, actions) {
                let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

                // Apply Parcel & Packaging Charge for products on the shop page
                if (currentPage === 'shop' && cart.some(item => item.type === 'product')) {
                    total += 3.5;
                }

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert('Transaction completed by ' + details.payer.name.given_name);
                    generateInvoice(details);
                    showThankYouMessage();
                });
            }
        }).render('#paypal-button-container');
    }

    function showThankYouMessage() {
        const modalBody = document.querySelector('#cartModal .modal-body');
        modalBody.innerHTML = `
            <div class="text-center">
                <h5>Thank you for your purchase!</h5>
                <p>Kajal will reach out to you shortly.</p>
                <button class="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
        `;
    }

    $('#searchKeyword, #searchArea').on('input change', function() {
        const keyword = $('#searchKeyword').val().toLowerCase();
        const area = $('#searchArea').val();

        // Filter function
        $('.property-item').each(function() {
            const serviceName = $(this).find('.pricing-card-title').text().toLowerCase();
            const serviceArea = $(this).find('.badge').text();

            const matchesKeyword = serviceName.includes(keyword);
            const matchesArea = area === "Select Area" || serviceArea === area;

            if (matchesKeyword && matchesArea) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

})(jQuery);

function showStep(step) {
    // Hide all steps
    $('.cart-step').removeClass('active');
    $('#currentStep').text(step);
    // Show the selected step
    $('#cartStep' + step).addClass('active');
    // Update the progress bar
    const progress = (step / 3) * 100;
    $('#progressBar').css('width', progress + '%').attr('aria-valuenow', progress);

    // Generate order summary if on step 3
    if (step === 3) {
        generateOrderSummary();
    }
}

function generateOrderSummary() {
    // Get cart items
    const cartItems = $('#cartItems').children().map(function () {
        return $(this).text();
    }).get();

    // Get customer details
    const customerName = $('#customerName').val();
    const customerEmail = $('#customerEmail').val();
    const customerPhone = $('#customerPhone').val();

    // Generate order summary HTML
    let orderSummaryHtml = '';
    orderSummaryHtml += '<div class="col-6" style="color:#000;"><h7>Cart Items:</h7><ul style="list-style-type: none;">';
    cartItems.forEach(item => {
        orderSummaryHtml += `<li>${item}</li>`;
    });
    orderSummaryHtml += '</ul></div>';
    orderSummaryHtml += '<div class="col-6" style="color:#000;"><h7>Contact Details:</h7>';
    orderSummaryHtml += `<p>Name: ${customerName}</p>`;
    orderSummaryHtml += `<p>Email: ${customerEmail}</p>`;
    orderSummaryHtml += `<p>Phone: ${customerPhone}</p></div>`;

    // Display order summary in the orderSummary div
    $('#orderSummary').html(orderSummaryHtml);
}

document.addEventListener("DOMContentLoaded", function () {
    // Configuration - dynamic based on screen size
    let itemsPerSlide = window.innerWidth < 720 ? 1 : 3; // Responsive items per slide
    const totalItems = 9; // Total real items (without clones)
    let slideBy = window.innerWidth < 720 ? 1 : 1; // How many items to advance/retreat per click
  
    // DOM elements
    const carousel = document.getElementById("multiCarousel");
    const carouselInner = document.getElementById("carouselInner");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const carouselTitle = document.getElementById("carouselTitle");
  
    // Function to update configuration based on screen size
    function updateConfig() {
      const isMobile = window.innerWidth < 720;
      itemsPerSlide = isMobile ? 1 : 3;
      slideBy = isMobile ? 1 : 1;
    }
  
    // Dynamically add clone elements
    function initializeClones() {
      const originalItems = Array.from(
        document.querySelectorAll(".multi-carousel-item:not(.clone)")
      );
  
      // Clear existing clones
      document.querySelectorAll(".clone").forEach((clone) => clone.remove());
  
      // Prepend clones of last items
      const lastClones = originalItems
        .slice(-itemsPerSlide)
        .map((item) => {
          const clone = item.cloneNode(true);
          clone.classList.add("clone");
          return clone;
        })
        .reverse();
      lastClones.forEach((clone) => carouselInner.prepend(clone));
  
      // Append clones of first items
      const firstClones = originalItems.slice(0, itemsPerSlide).map((item) => {
        const clone = item.cloneNode(true);
        clone.classList.add("clone");
        return clone;
      });
      firstClones.forEach((clone) => carouselInner.append(clone));
    }
  
    // Calculate and set the height for carousel items
    function setCarouselHeight() {
      const titleHeight = carouselTitle.offsetHeight;
      const windowHeight = window.innerHeight;
      const carouselHeight = windowHeight - titleHeight - 100;
      document.documentElement.style.setProperty(
        "--carousel-height",
        `${carouselHeight}px`
      );
    }
  
    // Initial setup
    updateConfig();
    initializeClones();
    setCarouselHeight();
  
    // Start with the first real set of images
    let currentIndex = 0; // Index of current visible center image (0 to totalItems-1)
    let position = itemsPerSlide; // Real position considering clones
    let isAnimating = false;
  
    // Update carousel position
    function updateCarouselPosition(animate = true) {
      if (animate) {
        carouselInner.style.transition = "transform 0.5s ease";
      } else {
        carouselInner.style.transition = "none";
      }
  
      const translateX = (position * -100) / itemsPerSlide;
      carouselInner.style.transform = `translateX(${translateX}%)`;
    }
  
    // Initialize position
    updateCarouselPosition(false);
  
    // Handle transition end
    carouselInner.addEventListener("transitionend", function () {
      isAnimating = false;
  
      // Handle infinite loop logic
      if (position >= totalItems + itemsPerSlide) {
        position = itemsPerSlide + (position - (totalItems + itemsPerSlide));
        updateCarouselPosition(false);
      } else if (position < itemsPerSlide) {
        position = totalItems + position;
        updateCarouselPosition(false);
      }
  
      currentIndex = (position - itemsPerSlide) % totalItems;
    });
  
    // Navigation functions
    function next() {
      if (isAnimating) return;
      isAnimating = true;
      position += slideBy;
      updateCarouselPosition();
    }
  
    function prev() {
      if (isAnimating) return;
      isAnimating = true;
      position -= slideBy;
      updateCarouselPosition();
    }
  
    // Event listeners for buttons
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
  
    // Mouse drag functionality
    let isDragging = false;
    let startX = 0;
    let startPosition = 0;
  
    // Prevent image drag
    const carouselImages = document.querySelectorAll("#carouselInner img");
    carouselImages.forEach((img) => {
      img.addEventListener("dragstart", (e) => {
        e.preventDefault();
      });
      img.style.pointerEvents = "none";
    });
  
    carousel.addEventListener("mousedown", startDrag);
    carousel.addEventListener("touchstart", startDrag, { passive: true });
  
    carousel.addEventListener("mousemove", drag);
    carousel.addEventListener("touchmove", drag, { passive: true });
  
    carousel.addEventListener("mouseup", endDrag);
    carousel.addEventListener("touchend", endDrag);
    carousel.addEventListener("mouseleave", endDrag);
  
    function startDrag(e) {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
  
      if (isAnimating) return;
  
      isDragging = true;
      startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      startPosition = position;
      carousel.classList.add("dragging");
      carouselInner.style.transition = "none";
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      registerUserActivity();
    }
  
    function drag(e) {
      if (!isDragging) return;
  
      const x = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      const walk = ((x - startX) / carousel.offsetWidth) * itemsPerSlide;
      const newPosition = startPosition - walk;
      const translateX = (newPosition * -100) / itemsPerSlide;
      carouselInner.style.transform = `translateX(${translateX}%)`;
    }
  
    function endDrag(e) {
      if (!isDragging) return;
  
      isDragging = false;
      carousel.classList.remove("dragging");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      carouselInner.style.transition = "transform 0.5s ease";
  
      const x = e.type?.includes("mouse")
        ? e.clientX
        : e.changedTouches
        ? e.changedTouches[0].clientX
        : startX;
      const walk = ((x - startX) / carousel.offsetWidth) * itemsPerSlide;
  
      if (walk > 0.2) {
        prev();
      } else if (walk < -0.2) {
        next();
      } else {
        updateCarouselPosition();
      }
  
      registerUserActivity();
    }
  
    // Keyboard navigation
    document.addEventListener("keydown", function (e) {
      if (
        carousel.offsetParent === null ||
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable
      ) {
        return;
      }
  
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prev();
          registerUserActivity();
          break;
        case "ArrowRight":
          e.preventDefault();
          next();
          registerUserActivity();
          break;
      }
    });
  
    // Auto-advance system
    let autoAdvanceInterval;
    let userActivityTimeout;
  
    function startAutoAdvance() {
      clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = setInterval(next, 5000);
    }
  
    function resetAutoAdvanceTimer() {
      clearTimeout(userActivityTimeout);
      clearInterval(autoAdvanceInterval);
      userActivityTimeout = setTimeout(startAutoAdvance, 10000);
    }
  
    function registerUserActivity() {
      resetAutoAdvanceTimer();
    }
  
    startAutoAdvance();
  
    carousel.addEventListener("mouseenter", () => {
      clearInterval(autoAdvanceInterval);
    });
  
    carousel.addEventListener("mouseleave", () => {
      resetAutoAdvanceTimer();
    });
  
    carousel.addEventListener("click", registerUserActivity);
    carousel.addEventListener("wheel", registerUserActivity);
  
    // Handle window resize
    window.addEventListener("resize", function () {
      const wasMobile = itemsPerSlide === 1;
      updateConfig();
      setCarouselHeight();
  
      // Only reinitialize if mobile state changed
      if (
        (wasMobile && itemsPerSlide > 1) ||
        (!wasMobile && itemsPerSlide === 1)
      ) {
        initializeClones();
        position = itemsPerSlide; // Reset position
        updateCarouselPosition(false);
      }
    });
  });
  