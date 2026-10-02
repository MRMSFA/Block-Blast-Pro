"use strict";


/* =========================================================
   BLOCK BLAST PRO
   USER INTERFACE + SETTINGS + GAME OVER
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const BLOCK_BLAST_SETTINGS_KEY =
    "blockblast_settings";


const defaultSettings = {

    music: true,

    sfx: true,

    vibration: true,

    musicVolume: 0.35

};


let blockBlastSettings = {

    ...defaultSettings

};



/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadBlockBlastSettings(){

    try{

        const saved =
            localStorage.getItem(
                BLOCK_BLAST_SETTINGS_KEY
            );


        if(saved){

            const parsed =
                JSON.parse(saved);


            blockBlastSettings = {

                ...defaultSettings,

                ...parsed

            };

        }

    }catch(error){

        console.warn(
            "Block Blast: Settings could not be loaded.",
            error
        );


        blockBlastSettings = {

            ...defaultSettings

        };

    }

}


/* =========================================================
   SAVE SETTINGS
========================================================= */

function saveBlockBlastSettings(){

    try{

        localStorage.setItem(

            BLOCK_BLAST_SETTINGS_KEY,

            JSON.stringify(
                blockBlastSettings
            )

        );

    }catch(error){

        console.warn(
            "Block Blast: Settings could not be saved.",
            error
        );

    }

}


loadBlockBlastSettings();



/* =========================================================
   VIBRATION
========================================================= */

function blockBlastVibrate(pattern){

    if(
        !blockBlastSettings.vibration
    ){

        return;

    }


    if(
        "vibrate" in navigator
    ){

        try{

            navigator.vibrate(
                pattern
            );

        }catch(error){

            /* Safe to ignore */

        }

    }

}


window.BlockBlastVibrate =
    blockBlastVibrate;



/* =========================================================
   UI OBJECT
========================================================= */

const BlockBlastUI = {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    loadingScreen:
        document.getElementById(
            "loading-screen"
        ),


    mainMenu:
        document.getElementById(
            "main-menu"
        ),


    game:
        document.getElementById(
            "game"
        ),


    playButton:
        document.getElementById(
            "play-button"
        ),


    menuBestScore:
        document.getElementById(
            "menu-best-score"
        ),


    settingsButton:
        document.getElementById(
            "settings-button"
        ),


    settingsPanel:
        document.getElementById(
            "settings-panel"
        ),


    settingsClose:
        document.getElementById(
            "settings-close"
        ),


    musicToggle:
        document.getElementById(
            "music-toggle"
        ),


    sfxToggle:
        document.getElementById(
            "sfx-toggle"
        ),


    vibrationToggle:
        document.getElementById(
            "vibration-toggle"
        ),


    musicVolume:
        document.getElementById(
            "music-volume"
        ),


    musicVolumeValue:
        document.getElementById(
            "music-volume-value"
        ),


    fullscreenButton:
        document.getElementById(
            "fullscreen-button"
        ),



    /* =====================================================
       INITIALIZE
    ===================================================== */

    init(){

        this.setupPlayButton();

        this.setupSettings();

        this.updateMenuBestScore();

        this.updateSettingsUI();

        this.showMainMenu();

    },



    /* =====================================================
       PLAY BUTTON
    ===================================================== */

    setupPlayButton(){

        if(!this.playButton){

            return;

        }


        this.playButton.addEventListener(
            "click",
            () => {


                if(
                    window.BlockBlastSound &&
                    typeof window.BlockBlastSound.click ===
                    "function"
                ){

                    window.BlockBlastSound.click();

                }


                blockBlastVibrate(15);


                if(
                    window.BlockBlastMusic &&
                    typeof window.BlockBlastMusic.start ===
                    "function"
                ){

                    window.BlockBlastMusic.start();

                }


                this.startGame();

            }
        );

    },



    /* =====================================================
       START GAME
    ===================================================== */

    startGame(){

        this.hideMainMenu();

        this.hideSettings();

        this.showGame();


        /* ================================================
           RESET SCORE
        ================================================= */

        if(
            typeof resetScore ===
            "function"
        ){

            resetScore();

        }


        /* ================================================
           SETUP BOARD
        ================================================= */

        if(
            typeof setupBoard ===
            "function"
        ){

            setupBoard();

        }


        /* ================================================
           GENERATE BLOCKS
        ================================================= */

        if(
            typeof generateBlocks ===
            "function"
        ){

            generateBlocks();

        }


        /* ================================================
           ENABLE DRAGGING
        ================================================= */

        if(
            typeof enableDragging ===
            "function"
        ){

            enableDragging();

        }


        /* ================================================
           UPDATE SCORE
        ================================================= */

        if(
            typeof updateScoreUI ===
            "function"
        ){

            updateScoreUI();

        }


        this.updateMenuBestScore();

    },



    /* =====================================================
       SHOW GAME
    ===================================================== */

    showGame(){

        if(!this.game){

            return;

        }


        this.game.classList.add(
            "active"
        );

    },



    /* =====================================================
       HIDE GAME
    ===================================================== */

    hideGame(){

        if(!this.game){

            return;

        }


        this.game.classList.remove(
            "active"
        );

    },



    /* =====================================================
       SHOW MAIN MENU
    ===================================================== */

    showMainMenu(){

        if(!this.mainMenu){

            return;

        }


        this.mainMenu.classList.add(
            "active"
        );


        this.hideGame();

        this.updateMenuBestScore();

    },



    /* =====================================================
       HIDE MAIN MENU
    ===================================================== */

    hideMainMenu(){

        if(!this.mainMenu){

            return;

        }


        this.mainMenu.classList.remove(
            "active"
        );

    },



    /* =====================================================
       LOADING
    ===================================================== */

    hideLoading(){

        if(!this.loadingScreen){

            return;

        }


        this.loadingScreen.classList.add(
            "hidden"
        );

    },


    showLoading(){

        if(!this.loadingScreen){

            return;

        }


        this.loadingScreen.classList.remove(
            "hidden"
        );

    },



    /* =====================================================
       BEST SCORE
    ===================================================== */

    updateMenuBestScore(){

        if(!this.menuBestScore){

            return;

        }


        let best = 0;


        if(
            typeof getBestScore ===
            "function"
        ){

            best =
                getBestScore();

        }else{

            try{

                best =
                    Number(
                        localStorage.getItem(
                            "blockblast_best"
                        )
                    ) || 0;

            }catch(error){

                best = 0;

            }

        }


        this.menuBestScore.textContent =
            best.toLocaleString();

    },



    /* =====================================================
       SETTINGS SETUP
    ===================================================== */

    setupSettings(){

        if(this.settingsButton){

            this.settingsButton.addEventListener(
                "click",
                () => {

                    if(
                        window.BlockBlastSound &&
                        typeof window.BlockBlastSound.click ===
                        "function"
                    ){

                        window.BlockBlastSound.click();

                    }


                    blockBlastVibrate(10);

                    this.openSettings();

                }
            );

        }


        if(this.settingsClose){

            this.settingsClose.addEventListener(
                "click",
                () => {

                    if(
                        window.BlockBlastSound &&
                        typeof window.BlockBlastSound.click ===
                        "function"
                    ){

                        window.BlockBlastSound.click();

                    }


                    this.closeSettings();

                }
            );

        }


        if(this.musicToggle){

            this.musicToggle.addEventListener(
                "change",
                () => {

                    const enabled =
                        this.musicToggle.checked;


                    blockBlastSettings.music =
                        enabled;


                    saveBlockBlastSettings();


                    if(
                        window.BlockBlastMusic &&
                        typeof window.BlockBlastMusic.setEnabled ===
                        "function"
                    ){

                        window.BlockBlastMusic.setEnabled(
                            enabled
                        );

                    }


                    blockBlastVibrate(10);

                    this.updateSettingsUI();

                }
            );

        }


        if(this.sfxToggle){

            this.sfxToggle.addEventListener(
                "change",
                () => {

                    blockBlastSettings.sfx =
                        this.sfxToggle.checked;


                    saveBlockBlastSettings();


                    blockBlastVibrate(10);

                    this.updateSettingsUI();

                }
            );

        }


        if(this.vibrationToggle){

            this.vibrationToggle.addEventListener(
                "change",
                () => {

                    blockBlastSettings.vibration =
                        this.vibrationToggle.checked;


                    saveBlockBlastSettings();


                    if(
                        blockBlastSettings.vibration
                    ){

                        blockBlastVibrate(20);

                    }


                    this.updateSettingsUI();

                }
            );

        }


        if(this.musicVolume){

            this.musicVolume.addEventListener(
                "input",
                () => {

                    const volume =
                        Number(
                            this.musicVolume.value
                        );


                    blockBlastSettings.musicVolume =
                        volume;


                    saveBlockBlastSettings();


                    if(
                        window.BlockBlastMusic &&
                        typeof window.BlockBlastMusic.setVolume ===
                        "function"
                    ){

                        window.BlockBlastMusic.setVolume(
                            volume
                        );

                    }


                    this.updateVolumeText();

                }
            );

        }


        if(this.fullscreenButton){

            this.fullscreenButton.addEventListener(
                "click",
                () => {

                    if(
                        window.BlockBlastSound &&
                        typeof window.BlockBlastSound.click ===
                        "function"
                    ){

                        window.BlockBlastSound.click();

                    }


                    this.toggleFullscreen();

                }
            );

        }


        if(this.settingsPanel){

            this.settingsPanel.addEventListener(
                "click",
                event => {

                    if(
                        event.target ===
                        this.settingsPanel
                    ){

                        this.closeSettings();

                    }

                }
            );

        }

    },



    /* =====================================================
       OPEN SETTINGS
    ===================================================== */

    openSettings(){

        if(!this.settingsPanel){

            return;

        }


        this.updateSettingsUI();


        this.settingsPanel.classList.add(
            "active"
        );


        this.settingsPanel.style.display =
            "flex";

    },



    /* =====================================================
       CLOSE SETTINGS
    ===================================================== */

    closeSettings(){

        if(!this.settingsPanel){

            return;

        }


        this.settingsPanel.classList.remove(
            "active"
        );


        this.settingsPanel.style.display =
            "";

    },


    hideSettings(){

        this.closeSettings();

    },



    /* =====================================================
       UPDATE SETTINGS UI
    ===================================================== */

    updateSettingsUI(){

        if(this.musicToggle){

            this.musicToggle.checked =
                Boolean(
                    blockBlastSettings.music
                );

        }


        if(this.sfxToggle){

            this.sfxToggle.checked =
                Boolean(
                    blockBlastSettings.sfx
                );

        }


        if(this.vibrationToggle){

            this.vibrationToggle.checked =
                Boolean(
                    blockBlastSettings.vibration
                );

        }


        if(this.musicVolume){

            this.musicVolume.value =
                blockBlastSettings.musicVolume;

        }


        this.updateVolumeText();

    },



    /* =====================================================
       VOLUME TEXT
    ===================================================== */

    updateVolumeText(){

        if(!this.musicVolumeValue){

            return;

        }


        const percentage =
            Math.round(
                Number(
                    blockBlastSettings.musicVolume
                ) * 100
            );


        this.musicVolumeValue.textContent =
            percentage + "%";

    },



    /* =====================================================
       FULLSCREEN
    ===================================================== */

    async toggleFullscreen(){

        try{

            if(!document.fullscreenElement){

                await document.documentElement.requestFullscreen();

            }else{

                await document.exitFullscreen();

            }

        }catch(error){

            console.warn(
                "Fullscreen unavailable.",
                error
            );

        }

    }

};



/* =========================================================
   GAME OVER
========================================================= */

function showGameOver(){

    let overlay =
        document.getElementById(
            "game-over"
        );


    if(!overlay){

        overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "game-over";


        const panel =
            document.createElement(
                "div"
            );


        panel.className =
            "game-over-panel";


        panel.innerHTML = `

            <div
                class="game-over-badge"
                id="new-high-score-badge"
            >
                🏆 NEW HIGH SCORE
            </div>


            <h1>
                GAME OVER
            </h1>


            <p>
                No more moves available
            </p>


            <div class="game-over-stats">


                <div class="game-over-stat">

                    <span>
                        SCORE
                    </span>

                    <strong id="game-over-score">
                        0
                    </strong>

                </div>


                <div class="game-over-stat">

                    <span>
                        BEST
                    </span>

                    <strong id="game-over-best">
                        0
                    </strong>

                </div>


            </div>


            <button
                id="restart-game"
                type="button"
            >
                PLAY AGAIN
            </button>

        `;


        overlay.appendChild(
            panel
        );


        document.body.appendChild(
            overlay
        );


        /* ================================================
           FALLBACK STYLING
           Makes the new badge work even if CSS
           doesn't contain its styling yet.
        ================================================= */

        if(
            !document.getElementById(
                "blockblast-gameover-fallback"
            )
        ){

            const style =
                document.createElement(
                    "style"
                );


            style.id =
                "blockblast-gameover-fallback";


            style.textContent = `

                #game-over {
                    position: fixed;
                    inset: 0;
                    z-index: 50000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: rgba(5, 8, 18, .78);
                    backdrop-filter: blur(14px);
                }

                .game-over-panel {
                    width: min(420px, 92vw);
                    padding: 34px 28px;
                    border-radius: 26px;
                    text-align: center;
                    background: rgba(18, 24, 40, .96);
                    border: 1px solid rgba(255,255,255,.12);
                    box-shadow: 0 25px 80px rgba(0,0,0,.45);
                    animation: blockBlastGameOverIn .35s ease both;
                }

                .game-over-panel h1 {
                    margin: 12px 0 8px;
                }

                .game-over-panel p {
                    margin: 0 0 24px;
                    opacity: .7;
                }

                .game-over-badge {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: fit-content;
                    margin: 0 auto 8px;
                    padding: 8px 14px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    background: rgba(255, 193, 7, .14);
                    border: 1px solid rgba(255, 193, 7, .35);
                    animation: blockBlastBadge .7s ease both;
                }

                .game-over-stats {
                    display: flex;
                    justify-content: center;
                    gap: 14px;
                    margin: 20px 0 26px;
                }

                .game-over-stat {
                    min-width: 120px;
                    padding: 15px;
                    border-radius: 16px;
                    background: rgba(255,255,255,.05);
                }

                .game-over-stat span {
                    display: block;
                    font-size: 10px;
                    letter-spacing: 1.5px;
                    opacity: .55;
                    margin-bottom: 5px;
                }

                .game-over-stat strong {
                    display: block;
                    font-size: 24px;
                }

                #restart-game {
                    width: 100%;
                    padding: 15px 20px;
                    border: 0;
                    border-radius: 14px;
                    cursor: pointer;
                    font-weight: 800;
                    font-size: 15px;
                }

                @keyframes blockBlastGameOverIn {
                    from {
                        opacity: 0;
                        transform: translateY(18px) scale(.96);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes blockBlastBadge {
                    0% {
                        opacity: 0;
                        transform: scale(.7);
                    }

                    70% {
                        transform: scale(1.08);
                    }

                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

            `;


            document.head.appendChild(
                style
            );

        }

    }


    /* =====================================================
       SCORE
    ===================================================== */

    const finalScore =
        typeof getScore ===
        "function"

            ? getScore()

            : 0;


    const finalBest =
        typeof getBestScore ===
        "function"

            ? getBestScore()

            : 0;


    const scoreElement =
        document.getElementById(
            "game-over-score"
        );


    const bestElement =
        document.getElementById(
            "game-over-best"
        );


    if(scoreElement){

        scoreElement.textContent =
            finalScore.toLocaleString();

    }


    if(bestElement){

        bestElement.textContent =
            finalBest.toLocaleString();

    }


    /* =====================================================
       NEW HIGH SCORE BADGE
    ===================================================== */

    const badge =
        document.getElementById(
            "new-high-score-badge"
        );


    const isRecord =
        typeof isNewHighScore ===
        "function"

            ? isNewHighScore()

            : false;


    if(badge){

        badge.style.display =
            isRecord
                ? "flex"
                : "none";

    }


    /* =====================================================
       SHOW OVERLAY
    ===================================================== */

    overlay.style.display =
        "flex";


    overlay.classList.add(
        "active"
    );


    /* =====================================================
       GAME OVER SOUND
    ===================================================== */

    if(
        window.BlockBlastSound &&
        typeof window.BlockBlastSound.gameOver ===
        "function"
    ){

        window.BlockBlastSound.gameOver();

    }


    blockBlastVibrate([
        70,
        50,
        120
    ]);


    /* =====================================================
       RESTART
    ===================================================== */

    const restart =
        document.getElementById(
            "restart-game"
        );


    if(restart){

        restart.onclick = () => {


            if(
                window.BlockBlastSound &&
                typeof window.BlockBlastSound.click ===
                "function"
            ){

                window.BlockBlastSound.click();

            }


            blockBlastVibrate(20);


            overlay.style.display =
                "none";


            overlay.classList.remove(
                "active"
            );


            if(
                window.BlockBlastMusic &&
                typeof window.BlockBlastMusic.start ===
                "function"
            ){

                window.BlockBlastMusic.start();

            }


            if(
                typeof resetGame ===
                "function"
            ){

                resetGame();

            }


            if(
                typeof updateScoreUI ===
                "function"
            ){

                updateScoreUI();

            }

        };

    }

}



/* =========================================================
   GLOBAL
========================================================= */

window.BlockBlastUI =
    BlockBlastUI;


window.showGameOver =
    showGameOver;