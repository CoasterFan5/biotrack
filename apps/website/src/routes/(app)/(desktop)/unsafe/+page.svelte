<script lang="ts">
	import MdiLockOpenAlert from '~icons/mdi/lock-open-alert';
</script>

<p><a href="/">← back home</a></p>
<h1>Your connection is not private <MdiLockOpenAlert width="2rem" height="2rem" /></h1>
<h2>A small browser mishap</h2>
<p>
	If your browser reports this page as unsafe, it is mistaken. While the warning is accurate (this
	page fakes an HTTPS certificate, which is unsafe, as it is not verified by a certificate
	authority), the page itself won't harm your computer, and it still remains encrypted from bad
	actors.
</p>
<p>
	What this means is that, as mentioned before, with no official certificate authority, this page is
	essentially acting like how a true malicious connection would act; by faking an HTTPS certificate,
	this <i>could</i> be some Man-in-the-Middle attack.
</p>

<style>
	h1 {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
