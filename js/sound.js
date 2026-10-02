"use strict";


/* =========================================================
   BLOCK BLAST PRO
   PROFESSIONAL SOUND EFFECT SYSTEM
========================================================= */


const BlockBlastSound = {

    context: null,

    masterGain: null,

    enabled: true,

    volume: 0.42,


    /* =====================================================
       INITIALIZE AUDIO
    ===================================================== */

    init(){

        if(this.context){

            return;

        }


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if(!AudioContext){

            return;

        }


        try{

            this.context =
                new AudioContext();


            this.masterGain =
                this.context.createGain();


            this.masterGain.gain.value =
                this.enabled
                    ? this.volume
                    : 0;


            this.masterGain.connect(
                this.context.destination
            );


        }catch(error){

            console.warn(
                "Block Blast: Sound unavailable.",
                error
            );

        }

    },


    /* =====================================================
       RESUME AUDIO
    ===================================================== */

    resume(){

        this.init();


        if(
            this.context &&
            this.context.state ===
            "suspended"
        ){

            this.context.resume();

        }

    },


    /* =====================================================
       MASTER SOUND
    ===================================================== */

    setEnabled(enabled){

        this.enabled =
            Boolean(enabled);


        if(
            typeof blockBlastSettings !==
            "undefined"
        ){

            blockBlastSettings.sfx =
                this.enabled;

        }


        this.init();


        if(
            this.context &&
            this.masterGain
        ){

            this.masterGain.gain.setTargetAtTime(

                this.enabled
                    ? this.volume
                    : 0,

                this.context.currentTime,

                0.05

            );

        }


        if(
            typeof saveBlockBlastSettings ===
            "function"
        ){

            saveBlockBlastSettings();

        }

    },


    /* =====================================================
       TOGGLE
    ===================================================== */

    toggle(){

        this.setEnabled(
            !this.enabled
        );

    },


    /* =====================================================
       VOLUME
    ===================================================== */

    setVolume(volume){

        volume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(volume)
                )
            );


        this.volume =
            volume;


        this.init();


        if(
            this.context &&
            this.masterGain
        ){

            this.masterGain.gain.setTargetAtTime(

                this.enabled
                    ? volume
                    : 0,

                this.context.currentTime,

                0.05

            );

        }

    },


    /* =====================================================
       SIMPLE TONE
    ===================================================== */

    tone(
        frequency,
        duration,
        type = "sine",
        volume = 0.15,
        slideTo = null
    ){

        if(!this.enabled){

            return;

        }


        this.resume();


        if(
            !this.context ||
            !this.masterGain
        ){

            return;

        }


        const now =
            this.context.currentTime;


        const oscillator =
            this.context.createOscillator();


        const gain =
            this.context.createGain();


        oscillator.type =
            type;


        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );


        if(slideTo !== null){

            oscillator.frequency.exponentialRampToValueAtTime(

                Math.max(
                    1,
                    slideTo
                ),

                now + duration

            );

        }


        gain.gain.setValueAtTime(
            0.001,
            now
        );


        gain.gain.exponentialRampToValueAtTime(

            Math.max(
                0.001,
                volume
            ),

            now + 0.008

        );


        gain.gain.exponentialRampToValueAtTime(

            0.001,

            now + duration

        );


        oscillator.connect(
            gain
        );


        gain.connect(
            this.masterGain
        );


        oscillator.start(
            now
        );


        oscillator.stop(
            now + duration + 0.03
        );

    },


    /* =====================================================
       TWO TONE
    ===================================================== */

    doubleTone(
        first,
        second,
        delay = 0.07,
        volume = 0.12
    ){

        if(!this.enabled){

            return;

        }


        this.resume();


        if(!this.context){

            return;

        }


        this.tone(
            first,
            0.16,
            "sine",
            volume
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        second,
                        0.22,
                        "sine",
                        volume
                    );

                }

            },
            delay * 1000
        );

    },


    /* =====================================================
       PICKUP
    ===================================================== */

    pickup(){

        this.doubleTone(
            360,
            520,
            0.055,
            0.09
        );

    },


    /* =====================================================
       PLACE
    ===================================================== */

    place(){

        this.tone(
            180,
            0.11,
            "triangle",
            0.13,
            125
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        260,
                        0.09,
                        "sine",
                        0.07
                    );

                }

            },
            35
        );

    },


    /* =====================================================
       INVALID
    ===================================================== */

    invalid(){

        this.tone(
            150,
            0.16,
            "sawtooth",
            0.075,
            105
        );

    },


    /* =====================================================
       LINE CLEAR
    ===================================================== */

    lineClear(){

        if(!this.enabled){

            return;

        }


        this.resume();


        this.tone(
            520,
            0.18,
            "sine",
            0.10
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        660,
                        0.20,
                        "sine",
                        0.11
                    );

                }

            },
            80
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        880,
                        0.28,
                        "sine",
                        0.09
                    );

                }

            },
            170
        );

    },


    /* =====================================================
       COMBO
    ===================================================== */

    combo(){

        if(!this.enabled){

            return;

        }


        this.resume();


        const notes = [

            440,
            554.37,
            659.25,
            880

        ];


        notes.forEach(
            (frequency, index) => {

                setTimeout(
                    () => {

                        if(this.enabled){

                            this.tone(
                                frequency,
                                0.22,
                                "sine",
                                0.11
                            );

                        }

                    },
                    index * 75
                );

            }
        );

    },


    /* =====================================================
       SCORE
    ===================================================== */

    score(){

        this.tone(
            760,
            0.10,
            "sine",
            0.045,
            920
        );

    },


    /* =====================================================
       NEW BLOCKS
    ===================================================== */

    newBlocks(){

        if(!this.enabled){

            return;

        }


        this.resume();


        this.tone(
            330,
            0.16,
            "sine",
            0.055
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        440,
                        0.17,
                        "sine",
                        0.06
                    );

                }

            },
            85
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        554.37,
                        0.22,
                        "sine",
                        0.065
                    );

                }

            },
            175
        );

    },


    /* =====================================================
       BUTTON CLICK
    ===================================================== */

    click(){

        this.tone(
            420,
            0.08,
            "sine",
            0.065,
            500
        );

    },


    /* =====================================================
       NEW HIGH SCORE
    ===================================================== */

    newHighScore(){

        if(!this.enabled){

            return;

        }


        this.resume();


        const notes = [

            523.25,
            659.25,
            783.99,
            1046.50

        ];


        notes.forEach(
            (frequency, index) => {

                setTimeout(
                    () => {

                        if(this.enabled){

                            this.tone(
                                frequency,
                                0.30,
                                "sine",
                                0.12
                            );

                        }

                    },
                    index * 105
                );

            }
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        1318.51,
                        0.45,
                        "sine",
                        0.10
                    );

                }

            },
            450
        );

    },


    /* =====================================================
       GAME OVER
    ===================================================== */

    gameOver(){

        if(!this.enabled){

            return;

        }


        this.resume();


        this.tone(
            330,
            0.30,
            "triangle",
            0.11,
            250
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        250,
                        0.36,
                        "triangle",
                        0.12,
                        185
                    );

                }

            },
            170
        );


        setTimeout(
            () => {

                if(this.enabled){

                    this.tone(
                        185,
                        0.55,
                        "sine",
                        0.10,
                        130
                    );

                }

            },
            390
        );

    }

};



/* =========================================================
   APPLY SAVED SFX SETTINGS
========================================================= */

if(
    typeof blockBlastSettings !==
    "undefined"
){

    BlockBlastSound.enabled =
        Boolean(
            blockBlastSettings.sfx
        );

}



/* =========================================================
   SEPARATE BACKGROUND MUSIC SYSTEM
========================================================= */

const BlockBlastMusic = {

    context: null,

    musicGain: null,

    enabled: true,

    volume: 0.18,

    playing: false,

    timer: null,


    /* =====================================================
       INITIALIZE MUSIC
    ===================================================== */

    init(){

        if(this.context){

            return true;

        }


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if(!AudioContext){

            return false;

        }


        try{

            this.context =
                new AudioContext();


            this.musicGain =
                this.context.createGain();


            this.musicGain.gain.value =
                this.enabled
                    ? this.volume
                    : 0;


            this.musicGain.connect(
                this.context.destination
            );


            return true;

        }catch(error){

            console.warn(
                "Block Blast: Music unavailable.",
                error
            );


            return false;

        }

    },


    /* =====================================================
       SYNC SETTINGS
    ===================================================== */

    syncSettings(){

        if(
            typeof blockBlastSettings !==
            "undefined"
        ){

            if(
                typeof blockBlastSettings.music !==
                "undefined"
            ){

                this.enabled =
                    Boolean(
                        blockBlastSettings.music
                    );

            }


            if(
                typeof blockBlastSettings.musicVolume ===
                "number"
            ){

                this.volume =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            blockBlastSettings.musicVolume
                        )
                    );

            }

        }

    },


    /* =====================================================
       RESUME
    ===================================================== */

    resume(){

        if(!this.init()){

            return;

        }


        if(
            this.context &&
            this.context.state ===
            "suspended"
        ){

            this.context.resume();

        }

    },


    /* =====================================================
       PLAY MUSIC NOTE
    ===================================================== */

    note(
        frequency,
        duration,
        startTime,
        volume = 0.065
    ){

        if(
            !this.context ||
            !this.musicGain
        ){

            return;

        }


        const oscillator =
            this.context.createOscillator();


        const gain =
            this.context.createGain();


        oscillator.type =
            "sine";


        oscillator.frequency.setValueAtTime(
            frequency,
            startTime
        );


        gain.gain.setValueAtTime(
            0.001,
            startTime
        );


        gain.gain.exponentialRampToValueAtTime(
            Math.max(
                0.001,
                volume
            ),
            startTime + 0.08
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + duration
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            this.musicGain
        );


        oscillator.start(
            startTime
        );


        oscillator.stop(
            startTime + duration + 0.05
        );

    },


    /* =====================================================
       CALM BACKGROUND MUSIC
    ===================================================== */

    playPhrase(){

        if(
            !this.playing ||
            !this.enabled
        ){

            return;

        }


        this.resume();


        if(!this.context){

            return;

        }


        const now =
            this.context.currentTime + 0.05;


        const melody = [

            [261.63, 0.55],
            [329.63, 0.55],
            [392.00, 0.70],
            [329.63, 0.55],

            [293.66, 0.55],
            [349.23, 0.55],
            [440.00, 0.70],
            [349.23, 0.55],

            [261.63, 0.55],
            [329.63, 0.55],
            [392.00, 0.70],
            [440.00, 0.70],

            [392.00, 0.55],
            [349.23, 0.55],
            [329.63, 0.70],
            [261.63, 0.90]

        ];


        let position =
            now;


        melody.forEach(
            ([frequency, duration]) => {

                this.note(
                    frequency,
                    duration,
                    position,
                    0.065
                );


                position +=
                    duration + 0.04;

            }
        );


        /* SOFT HARMONY */

        this.note(
            130.81,
            3.2,
            now,
            0.018
        );


        this.note(
            164.81,
            3.2,
            now + 3.45,
            0.018
        );


        this.note(
            196.00,
            3.2,
            now + 6.90,
            0.018
        );


        this.note(
            146.83,
            3.2,
            now + 10.35,
            0.018
        );


        this.timer =
            setTimeout(
                () => {

                    this.playPhrase();

                },
                9800
            );

    },


    /* =====================================================
       START MUSIC
    ===================================================== */

    start(){

        this.syncSettings();


        if(!this.enabled){

            return;

        }


        if(this.playing){

            this.resume();

            return;

        }


        if(!this.init()){

            return;

        }


        this.resume();


        this.playing =
            true;


        this.playPhrase();

    },


    /* =====================================================
       STOP MUSIC
    ===================================================== */

    stop(){

        this.playing =
            false;


        if(this.timer){

            clearTimeout(
                this.timer
            );


            this.timer =
                null;

        }


        if(
            this.context &&
            this.musicGain
        ){

            this.musicGain.gain.cancelScheduledValues(
                this.context.currentTime
            );


            this.musicGain.gain.setTargetAtTime(
                0,
                this.context.currentTime,
                0.08
            );

        }

    },


    /* =====================================================
       MUSIC ON / OFF
    ===================================================== */

    setEnabled(enabled){

        this.enabled =
            Boolean(enabled);


        if(
            typeof blockBlastSettings !==
            "undefined"
        ){

            blockBlastSettings.music =
                this.enabled;

        }


        this.init();


        if(
            this.context &&
            this.musicGain
        ){

            this.musicGain.gain.setTargetAtTime(

                this.enabled
                    ? this.volume
                    : 0,

                this.context.currentTime,

                0.08

            );

        }


        if(
            this.enabled &&
            !this.playing
        ){

            this.playing =
                true;


            this.playPhrase();

        }


        if(!this.enabled){

            this.playing =
                false;


            if(this.timer){

                clearTimeout(
                    this.timer
                );


                this.timer =
                    null;

            }

        }


        if(
            typeof saveBlockBlastSettings ===
            "function"
        ){

            saveBlockBlastSettings();

        }

    },


    /* =====================================================
       MUSIC VOLUME
    ===================================================== */

    setVolume(volume){

        volume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(volume)
                )
            );


        this.volume =
            volume;


        if(
            typeof blockBlastSettings !==
            "undefined"
        ){

            blockBlastSettings.musicVolume =
                volume;

        }


        this.init();


        if(
            this.context &&
            this.musicGain
        ){

            this.musicGain.gain.setTargetAtTime(

                this.enabled
                    ? volume
                    : 0,

                this.context.currentTime,

                0.08

            );

        }

    }

};



/* =========================================================
   APPLY SAVED MUSIC SETTINGS
========================================================= */

if(
    typeof blockBlastSettings !==
    "undefined"
){

    BlockBlastMusic.enabled =
        Boolean(
            blockBlastSettings.music
        );


    if(
        typeof blockBlastSettings.musicVolume ===
        "number"
    ){

        BlockBlastMusic.volume =
            Math.max(
                0,
                Math.min(
                    1,
                    blockBlastSettings.musicVolume
                )
            );

    }

}



/* =========================================================
   GLOBALS
========================================================= */

window.BlockBlastSound =
    BlockBlastSound;


window.BlockBlastMusic =
    BlockBlastMusic;