
        var direction = 1
        var innercontainer = document.getElementById("containerinner");
        var bewegendefotoLeft = 0;
        var bewegendefotoSpeed = 3 * direction;
        var container = document.getElementById("containeromplaatjes");
        let copyinnercontainer = innercontainer.cloneNode(true);
        var copyleft = innercontainer.offsetLeft - innercontainer.offsetWidth * direction;
        var copyspeed = 3 * direction;
        var interval1;
        var interval2;





        container.appendChild(copyinnercontainer);
        copyinnercontainer.style.left = copyleft + "px";

        function beweeg() {
            interval1 = setInterval(function () {
                bewegendefotoLeft += bewegendefotoSpeed;
                innercontainer.style.left = bewegendefotoLeft + "px";

                // beweging naar rechts

                if (bewegendefotoLeft < -innercontainer.offsetWidth) {
                    bewegendefotoLeft = copyinnercontainer.offsetLeft + copyinnercontainer.offsetWidth;
                    innercontainer.style.left = bewegendefotoLeft + "px";
                }

                // beweging naar links

                if (bewegendefotoLeft > container.offsetWidth) {
                    bewegendefotoLeft = copyinnercontainer.offsetLeft - innercontainer.offsetWidth;
                    innercontainer.style.left = bewegendefotoLeft + "px";
                }
            }, 20);


            interval2 = setInterval(function () {
                copyleft += copyspeed;
                copyinnercontainer.style.left = copyleft + "px";


                // copy beweging naar rechts

                if (copyleft < -copyinnercontainer.offsetWidth) {
                    copyleft = innercontainer.offsetLeft + innercontainer.offsetWidth;
                    copyinnercontainer.style.left = copyleft + "px";
                }

                // copy beweging van links

                if (copyleft > container.offsetWidth) {
                    copyleft = innercontainer.offsetLeft - copyinnercontainer.offsetWidth;
                    copyinnercontainer.style.left = copyleft + "px";
                }
            }, 20);
        }

        beweeg();

        // DRAG GEDEELTE

        var isdown = false;
        var startX;
        var oldpositie;



        container.addEventListener("mousedown", function (e) {
            clearInterval(interval1);
            clearInterval(interval2);
            startX = e.clientX;
            oldpositie = startX
            isdown = true
            container.style.cursor = "grabbing";
        })



        container.addEventListener("mousemove", function (e) {
            if (!isdown) return;
            let nieuwepositie = e.clientX - oldpositie
            oldpositie = e.clientX;
            isdown = true;
            bewegendefotoLeft += nieuwepositie;
            copyleft += nieuwepositie;



            if (nieuwepositie > 0) {
                direction = 1; // Naar rechts gesleept
            } else if (nieuwepositie < 0) {
                direction = -1; // Naar links gesleept
            }


            bewegendefotoSpeed = 3 * direction;
            copyspeed = 3 * direction

            innercontainer.style.left = bewegendefotoLeft + "px";
            copyinnercontainer.style.left = copyleft + "px";


        })


        container.addEventListener("mouseup", function () {
            clearInterval(interval1);
            clearInterval(interval2);
            (beweeg());
            isdown = false;

        })


        container.addEventListener("mouseleave", function () {
            clearInterval(interval1);
            clearInterval(interval2);
            (beweeg());
            isdown = false;

        })




        // TODO: GRIJP BEWEGING




