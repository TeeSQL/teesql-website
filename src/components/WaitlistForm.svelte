<!--
  Email-capture form. The submit handler doesn't actually call
  anything yet — it just locks the input + button into a "you're in"
  state, matching the original React component. Real wiring happens
  later when the waitlist endpoint exists.

  The class string on the form is a prop so the EarlyAccess section
  can pass `flex-col` for the stacked layout while the in-nav variant
  (none, currently) could use the default row layout.
-->

<script lang="ts">
  let { class: extraClass = "" } = $props();
  let submitted = $state(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    submitted = true;
  }
</script>

<form class={`flex gap-2.5 ${extraClass}`} onsubmit={handleSubmit}>
  <input
    type="email"
    placeholder="you@enclave.dev"
    required
    disabled={submitted}
    class="flex-1 px-4 py-3 font-mono text-[0.82rem] bg-surface-raised border border-rule rounded-md text-ink-strong outline-none transition-all focus:border-mint focus:shadow-[0_0_0_3px_rgba(52,211,153,0.08)] placeholder:text-ink-dim disabled:opacity-50"
  />
  <button
    type="submit"
    disabled={submitted}
    class={`px-5 py-3 font-mono text-[0.82rem] font-semibold rounded-md whitespace-nowrap transition-all cursor-pointer ${submitted ? "bg-transparent text-mint border border-mint cursor-default" : "bg-mint text-page border-none hover:bg-mint-hi hover:-translate-y-px"}`}
  >
    {submitted ? "✓ you’re in" : "Request access"}
  </button>
</form>
