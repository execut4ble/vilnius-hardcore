<script lang="ts">
  import { enhance } from "$app/forms";

  let {
    selectedImage = $bindable(),
    displayImage = $bindable(),
    slug = null,
  } = $props();
  let is_image_uploading: boolean = $state(false);
  let fileUploadError: string | null | undefined = $state();
  let uploaded: boolean = $state(false);
  let selectedImageToSave = $state();

  function uploadImage() {
    is_image_uploading = true;

    return async ({ formData, update, result }) => {
      if (result.type === "success") {
        const fileObj: File = Object.fromEntries(formData).file as File;
        update().then(() => {
          displayImage = fileObj.name;
          is_image_uploading = false;
          uploaded = true;
          selectedImage = fileObj.name;
          selectedImageToSave = null;
        });
      }
      if (result.type === "failure") {
        is_image_uploading = false;
        fileUploadError = result.data.message;
      }
      if (result.type === "error") {
        is_image_uploading = false;
        console.log(result);
        fileUploadError = result.error.message;
      }
    };
  }
</script>

<form
  method="POST"
  action="?/upload_image"
  enctype="multipart/form-data"
  class="imageUpload"
  use:enhance={uploadImage}
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
