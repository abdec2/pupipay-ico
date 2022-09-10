$(document).ready(function () {
    /* **** scrollIt ***** */
    $(function () {
        $.scrollIt({
            upKey: 38,
            downKey: 40,
            easing: "linear",
            scrollTime: 600,
            activeClass: "active",
            onPageChange: null,
            topOffset: -120,
        });
    });
    /* **** End scrollIt ***** */


    /* **** Navigation Toggle Start **** */
    $(".navbar-collapse a").click(function () {
        $(".navbar-collapse").collapse("hide");
    });
    /* **** Navigation Toggle End **** */


    /* **** sticky **** */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 150) {
            $("header").addClass("nav-new");
        } else {
            $("header").removeClass("nav-new");
        }
    });
    /* **** sticky **** */



    $(function () {
        $("audio").audioPlayer();
    });


    /* **** Slider ***** */
    $(".artworks-wrp .multiple-items").slick({
        arrows: true,
        loop: true,
        dots: false,
        autoplay: false,
        autoplaySpeed: 4500,
        speed: 500,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 447,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    });
    /* ***** End Slider **** */


    /* **** Slider ***** */
    $(".contact-wrp .multiple-items").slick({
        arrows: false,
        loop: true,
        dots: false,
        autoplay: false,
        autoplaySpeed: 4500,
        speed: 500,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 6,
                },
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 447,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    });
    /* ***** End Slider **** */


    // REF : https://stackoverflow.com/a/31706360

    console.clear();

    $(".hero-wrp .hero-dt .counter-block ul li div h3 span").each(countUp);

    function countUp() {
        var num = $(this).text();
        var decimal = 0;
        if (num.indexOf(".") > 0) {
            decimal = num.toString().split(".")[1].length;
        }
        $(this)
            .prop("Counter", 0.0)
            .animate(
                {
                    Counter: $(this).text(),
                },
                {
                    duration: 2000,
                    easing: "swing",
                    step: function (now) {
                        $(this).text(parseFloat(now).toFixed(decimal));
                    },
                }
            );
    }

    /* **** AOS **** */
    AOS.init({
        duration: 1000,
    });
    /* **** End AOS **** */
});
