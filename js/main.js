"use strict";


/* =========================================================
   BLOCK BLAST PRO
   MAIN GAME INITIALIZER
========================================================= */


window.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================================
           INITIALIZE USER INTERFACE
        ===================================================== */

        if(
            window.BlockBlastUI &&
            typeof window.BlockBlastUI.init === "function"
        ){

            window.BlockBlastUI.init();

        }



        /* =====================================================
           LOADING ELEMENTS
        ===================================================== */

        const progress =
            document.getElementById(
                "loading-progress"
            );


        const percent =
            document.getElementById(
                "loading-percent"
            );


        const loadingText =
            document.getElementById(
                "loading-text"
            );



        /* =====================================================
           LOADING PROGRESS
        ===================================================== */

        let value = 0;


        const loadingSteps = [

            {
                value: 20,
                text: "LOADING CORE"
            },

            {
                value: 40,
                text: "BUILDING BOARD"
            },

            {
                value: 60,
                text: "LOADING BLOCKS"
            },

            {
                value: 80,
                text: "INITIALIZING SYSTEM"
            },

            {
                value: 100,
                text: "READY TO PLAY"
            }

        ];


        let step = 0;



        /* =====================================================
           PROGRESS ANIMATION
        ===================================================== */

        const progressTimer =
            setInterval(
                () => {


                    if(
                        step >=
                        loadingSteps.length
                    ){

                        clearInterval(
                            progressTimer
                        );

                        return;

                    }


                    const current =
                        loadingSteps[step];


                    value =
                        current.value;



                    if(progress){

                        progress.style.width =
                            value + "%";

                    }



                    if(percent){

                        percent.textContent =
                            value + "%";

                    }



                    if(loadingText){

                        loadingText.textContent =
                            current.text;

                    }


                    step++;


                },
                140
            );



        /* =====================================================
           FINISH LOADING
        ===================================================== */

        setTimeout(
            () => {


                if(
                    window.BlockBlastUI &&
                    typeof window.BlockBlastUI.hideLoading ===
                    "function"
                ){

                    window.BlockBlastUI.hideLoading();

                }


                setTimeout(
                    () => {


                        if(
                            window.BlockBlastUI &&
                            typeof window.BlockBlastUI.showMainMenu ===
                            "function"
                        ){

                            window.BlockBlastUI.showMainMenu();

                        }


                    },
                    300
                );


            },
            950
        );


    }
);