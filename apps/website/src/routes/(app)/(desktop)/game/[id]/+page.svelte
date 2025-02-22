<script lang="ts">
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	export let data;
	$: nameInput = data.game.name;
	let nameSubmissionButton: HTMLButtonElement;

	function showAcknowledgeModal() {
		pushState('', {
			modalShowing: 'acknowledgeJoinRequest',
		})
	}
</script>

<form use:enhance action="/game/{data.game.id}?/name" method="POST">
	<div class="name">
		Name: <input
			type="text"
			name="name"
			value={nameInput}
			on:change={() => nameSubmissionButton.click()}
		/>
	</div>
	<button type="submit" hidden bind:this={nameSubmissionButton}></button>
</form>

<p>id: {data.game.id}</p>
<p>max players: {data.game.playerCount ?? 'Arbitrary'}</p>

<h2>Play Information</h2>

<h3>Join Requests</h3>

{#if data.game.joinRequests.length > 0}
	{#each data.game.joinRequests as request}
		<div class="joinRequest">
			<p>Player: <a href="/player/{request.user.id}">{request.user.name}</a></p>
			<p>
				created at: {request.createdAt.toLocaleString()}
				<span class="gray">
					({dayjs.duration(dayjs(request.createdAt).diff(dayjs())).humanize()} ago)
				</span>
			</p>
			{#if request.forceSent}
				<p>force sent by: <a href="/officer/{request.forceSent.id}">{request.forceSent.name}</a></p>
			{/if}
			{#if request.createdAt.toString() !== request.updatedAt.toString()}
				<p>(updated at: {request.updatedAt.toLocaleString()})</p>
			{/if}
			<button on:click={showAcknowledgeModal} type="submit">acknowledge</button>
		</div>
	{/each}
{:else}
	<p>no join requests</p>
{/if}

<h3>Sessions</h3>
{#if data.game.sessions.length > 0}
	<ul>
		{#each data.game.sessions as session}
			<li>
				<a href="/game/{data.game.id}/session/{session.id}">{session.id}</a>
			</li>
		{/each}
	</ul>
{:else}
	<p>no sessions</p>
{/if}

<h2>Log</h2>

<p>created at: {data.game.createdAt.toLocaleString()}</p>
{#if data.game.updatedAt.toString() !== data.game.createdAt.toString()}
	<p>
		last updated at: {data.game.updatedAt.toLocaleString()}, ~{dayjs
			.duration(dayjs(data.game.updatedAt).diff(dayjs()))
			.humanize()} ago
	</p>
{/if}

{#if $page.state.modalShowing === 'acknowledgeJoinRequest'}
	<Modal on:close={() => history.back()}>
		<h1>Acknowledgement Warning</h1>
		<p>If this game is automatic, this will not push it through to the game;</p>
		<p>If this game is manual (i.e. no sensors or automatic components), this action is fine</p>
		<div class="buttons">
			<form method="POST" action="?/acknowledge">
				<button>Confirm</button>
			</form>
			<button on:click={() => history.back()}>Cancel</button>
		</div>
	</Modal>
{/if}

<style lang="scss">
	input {
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
	}

	.name {
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		gap: 1rem;
		align-items: center;
	}

	.joinRequest {
		border-left: 5px solid var(--color);
		padding: 1rem;
	}

	.gray {
		color: gray;
	}
</style>
