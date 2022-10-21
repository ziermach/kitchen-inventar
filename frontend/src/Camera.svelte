<script lang="ts">
    import Button, { Label } from "@smui/button";
    import Instacam from "instacam";
    import { createEventDispatcher, onMount } from "svelte";
    let camera;
    let cameraOpen = false;
    export let imageUrl = null;
    let image: string = null;

    const dispatch = createEventDispatcher<{ save: string; change }>();

    export const reset = () => {
        image = null;
        imageUrl = null;
    };

    onMount(() => {
        image = null;
        imageUrl = null;
        camera = new Instacam(document.querySelector("#canvas1"), {
            width: 200,
            height: 200,
            autostart: cameraOpen,
        });
    });
    function startVideoPrev() {
        dispatch("change");
        cameraOpen = true;
        camera.start();
    }

    function stopVideoPrev() {
        dispatch("change");
        cameraOpen = false;
        camera.stop();
    }

    async function takeSnapshot() {
        try {
            image = await camera.save("png", 1);
            dispatch("save", image);
            dispatch("change");
        } catch (error) {
            console.error(error);
        }
        stopVideoPrev();
    }
</script>

<Button on:click={cameraOpen ? takeSnapshot : startVideoPrev}
    ><Label>{cameraOpen ? "take photo" : "open camera"}</Label></Button
>
<canvas
    hidden={!cameraOpen}
    style="height: 200px; width: 200px;"
    id="canvas1"
/>

{#if image && !cameraOpen}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={image} alt="the product photo" />
{:else if imageUrl && !cameraOpen}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={imageUrl} alt="the current product photo" />
{/if}
