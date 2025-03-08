<script lang="ts">
  import { downloadURL } from '$lib/utils/download';
  import Frame from './frame.svelte';
  import { domToPng } from 'modern-screenshot';

  type CompositionLayout =
    | 'portrait'
    | 'portrait-no-padding'
    | 'double-landscape'
    | 'single-landscape32'
    | 'single-landscape169'
    | 'square';

  let compositionRef: HTMLDivElement;
  let loading = false;
  let layout: CompositionLayout = 'portrait';
  let frameImageSrc = '';
  let hasBlurredBg = false;

  const saveToImage = async () => {
    loading = true;
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach((b) => {
      (b as HTMLButtonElement).style.display = 'none';
    });

    try {
      const result = await domToPng(compositionRef, { scale: 4, quality: 0.9 });
      downloadURL(result, 'framed');
    } catch (error) {
      console.error('oops, something went wrong!', error);
    } finally {
      removeButtons.forEach((b) => {
        (b as HTMLButtonElement).style.display = 'block';
      });
      loading = false;
    }
  };

  const onImageChange = (newImage: string) => {
    frameImageSrc = newImage;
  };
</script>

<div class="wrapper">
  <div class="button-container">
    <button
      class="button"
      class:selected-button={layout === 'portrait'}
      on:click={() => {
        layout = 'portrait';
        hasBlurredBg = false;
      }}
    >
      Portrait
    </button>
    <button
      class="button"
      class:selected-button={layout === 'portrait-no-padding'}
      on:click={() => {
        layout = 'portrait-no-padding';
        hasBlurredBg = false;
      }}
    >
      Portrait - no padding
    </button>
    <button
      class="button"
      class:selected-button={layout === 'single-landscape32'}
      on:click={() => {
        layout = 'single-landscape32';
        hasBlurredBg = false;
      }}
    >
      Landscape 3:2
    </button>
    <button
      class="button"
      class:selected-button={layout === 'single-landscape169'}
      on:click={() => {
        layout = 'single-landscape169';
        hasBlurredBg = false;
      }}
    >
      Landscape 6:9
    </button>
    <button
      class="button"
      class:selected-button={layout === 'double-landscape'}
      on:click={() => {
        layout = 'double-landscape';
        hasBlurredBg = false;
      }}
    >
      Double landscape
    </button>
    <button
      class="button"
      class:selected-button={layout === 'square'}
      on:click={() => {
        layout = 'square';
        hasBlurredBg = false;
      }}
    >
      Square
    </button>
    <button
      class="button"
      class:selected-button={hasBlurredBg}
      on:click={() => {
        hasBlurredBg = !hasBlurredBg;
      }}
    >
      Blur BG
    </button>
  </div>
  <div
    class="composition"
    bind:this={compositionRef}
    class:has-padding={layout !== 'portrait-no-padding'}
  >
    {#if hasBlurredBg && frameImageSrc}
      <div class="background-blur" style="background-image: url({frameImageSrc});" />
    {/if}
    {#if layout === 'portrait'}
      <Frame aspectRatio="4 / 5" {onImageChange} />
    {:else if layout === 'portrait-no-padding'}
      <Frame aspectRatio="4 / 5" isRounded={false} {onImageChange} />
    {:else if layout === 'single-landscape32'}
      <Frame aspectRatio="3 / 2" {onImageChange} />
    {:else if layout === 'single-landscape169'}
      <Frame aspectRatio="16 / 9" {onImageChange} />
    {:else if layout === 'double-landscape'}
      <Frame {onImageChange} />
      <Frame {onImageChange} />
    {:else if layout === 'square'}
      <Frame aspectRatio="1" {onImageChange} />
    {/if}
  </div>

  <button class="button" on:click={saveToImage}>
    {#if loading}
      Saving...
    {:else}
      Save composition
    {/if}
  </button>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    background-color: lightgrey;
    width: 100%;
    min-height: 100%;
    padding: 1rem;
  }

  .has-padding {
    padding: 0.5rem;
  }

  .composition {
    width: 100%;
    aspect-ratio: 4 / 5;
    gap: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: white;
    position: relative;
    overflow: hidden;
  }

  .background-blur {
    background-color: black;
    background-size: cover;
    position: absolute;
    left: -25%;
    top: -25%;
    width: 150%;
    height: 150%;
    filter: blur(20px) brightness(1.2) contrast(0.8);
  }

  .button {
    border: 1px solid black;
    border-radius: 1rem;
    padding: 4px 8px;
    cursor: pointer;
    background: transparent;
    color: black;
  }

  .selected-button {
    background-color: lightgreen;
  }

  .button-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>
