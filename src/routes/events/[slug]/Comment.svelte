<script lang="ts">
  let { ...comment } = $props();
  let date: Date = $derived(new Date(comment.date));
</script>

<div class="comment">
  <div class="heading">
    <strong>{comment.author}</strong> wrote at {date.toLocaleString("lt-LT")}
  </div>

  <div class="content">
    {comment.content}
  </div>
</div>

<style>
  div.comment {
    margin-bottom: 2em;
  }

  div.comment .heading {
    margin-bottom: 0.6em;
  }

  div.comment .content {
    margin-left: 1em;
  }
</style>
