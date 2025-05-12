<script lang="ts">
  import { applyAction, deserialize } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";

  let {
    selectedImage = $bindable(),
    displayImage = $bindable(),
    slug = null,
  } = $props();
  let is_image_uploading: boolean = $state(false);
  let fileUploadError: string | null | undefined = $state();
  let uploaded: boolean = $state(false);
  let selectedImageToSave = $state();

  async function handleSubmit(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ) {
    event.preventDefault();
    is_image_uploading = true;
    const formData = new FormData(event.currentTarget);

    const response = await fetch(event.currentTarget.action, {
      method: "POST",
      body: formData,
    });

    let result: ActionResult;
    if (response.status === 413) {
      result = {
        type: "failure",
        status: 413,
        data: { message: "Image exceeds file size limits" },
      };
    } else {
      result = deserialize(await response.text());
    }

    if (result.type === "success") {
      const fileObj: File = Object.fromEntries(formData).file as File;
      await invalidateAll().then(() => {
        displayImage = fileObj.name;
        is_image_uploading = false;
        uploaded = true;
        selectedImage = fileObj.name;
        selectedImageToSave = null;
      });
    }
    if (result.type === "failure") {
      is_image_uploading = false;
      fileUploadError = result.data?.message;
    }
    if (result.type === "error" && result.error.status === 413) {
      is_image_uploading = false;
      const parts = result.error.message.split(" ");
      const limitBytes = parseInt(parts[6], 10);
      const limitMB = isNaN(limitBytes)
        ? null
        : (limitBytes / 1048576).toFixed(2);

      fileUploadError = limitMB
        ? `Image file size exceeds limit of ${limitMB} MB`
        : "Image exceeds file size limits";
    } else {
      applyAction(result);
    }
  }
</script>

<form
  method="POST"
  action="?/upload_image"
  enctype="multipart/form-data"
  class="imageUpload"
  onsubmit={handleSubmit}
>
  <div>
    <label class="imageUpload" for={slug ? slug : "file"}
      >{selectedImageToSave
        ? selectedImageToSave
        : displayImage
          ? displayImage
          : "Select an image"}</label
    >
    <input
      type="file"
      name="file"
      id={slug ? slug : "file"}
      accept="image/png, image/jpeg, image/webp"
      required
      onchange={(event) => {
        if (event.target instanceof HTMLInputElement) {
          const fileName: string = event.target.files
            ? event.target.files[0].name
            : "";
          selectedImageToSave = fileName;
        }
        uploaded = false;
        fileUploadError = "";
      }}
    />
    <input type="hidden" name="slug" value={slug} />
  </div>
  {#if selectedImageToSave && !uploaded}
    <button class="post action" disabled={is_image_uploading}>
      {#if is_image_uploading}
        Uploading...
      {:else}
        Upload
      {/if}
    </button>
  {/if}
  {#if displayImage}
    <button
      name="file"
      class="post action"
      onclick={() => {
        displayImage = "";
        selectedImage = "";
        selectedImageToSave = "";
      }}
    >
      Clear image
    </button>
  {/if}
  {#if fileUploadError}
    <br /><br />
    <p style="color: red">{fileUploadError}</p>
  {/if}
</form>

<style>
  form.imageUpload {
    width: 12em;
  }

  form.imageUpload label {
    word-wrap: break-word;
  }

  form.imageUpload input {
    display: none;
  }

  form.imageUpload label {
    border: 2px dashed var(--color-text);
    padding: 1.5em;
    margin-bottom: 1em;
  }

  form.imageUpload label:hover {
    border: 2px dashed var(--color-text-2);
    color: var(--color-text-2);
  }
</style>
