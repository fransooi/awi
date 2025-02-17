import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';
import { Accordion,	AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

function App()
{
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);


    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');

    }

    return (
        <div className="w-270" id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </div>
    )
}

export default App
