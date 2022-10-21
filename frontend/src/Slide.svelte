<script lang="ts">
    import Drawer, { Content, Header, Title, Scrim } from "@smui/drawer";
    import IconButton from "@smui/icon-button";
    import { createEventDispatcher } from "svelte";
    import Close from "svelte-material-icons/Close.svelte";

    export let open = false;
    export let variant = "modal";
    export let disabled = false;
    export let style = "";

    const dispatch = createEventDispatcher<{ close; open }>();

    const handleKeydown = (event) => {
        const key = event.key;
        if (key === "Escape") {
            open = false;
            dispatch("close");
        }
    };
</script>

<svelte:window on:keydown={handleKeydown} />

<div {style} class="slide-container">
    <!-- Don't include fixed={false} if this is a page wide drawer.
        It adds a style for absolute positioning. -->
    <Drawer {style} {variant} bind:open>
        <Header>
            <Title>
                <slot name="title" />
            </Title>
            <IconButton
                class="close-button"
                {disabled}
                on:click={() => {
                    open = false;
                    dispatch("close");
                }}
                ripple={false}
            >
                <Close />
            </IconButton>
        </Header>
        <div style="width:100%">
            <slot name="progress" />
        </div>
        <Content>
            <slot name="content" />
            <div class="actions">
                <slot name="actions" />
            </div>
            <div>
                <slot name="hints" />
            </div>
        </Content>
    </Drawer>
    <!-- Don't include fixed={false} if this is a page wide drawer.
        It adds a style for absolute positioning. -->
    <Scrim />
</div>
