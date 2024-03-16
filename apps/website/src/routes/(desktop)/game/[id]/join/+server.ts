import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/prismaConnection.js';
import type { RequestHandler } from './$types';
import { validateGame } from '$lib/server/validateGame';
import { joinRequestEvent } from '$lib/server/joinRequests';

export const POST: RequestHandler = async ({ params, url }) => {
	const userId = url.searchParams.get('user');

	if (!userId) {
		error(400, 'User ID not specified');
	}

	const game = await validateGame(params.id);

	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});

	if (!user) {
		error(400, 'User not found');
	}

	const existingJoinRequest = await prisma.joinRequest.update({
		where: {
			gameId: game.id,
			userId: user.id,
			acknowledged: false,
			cancelled: {
				is: null
			}
		},
		data: {
			cancelled: {
				create: {},
			},
		}
	});

	const joinRequest = await prisma.joinRequest.create({
		data: {
			gameId: game.id,
			userId: user.id,
			precedingJoinRequestId: existingJoinRequest?.id,
		}
	});

	joinRequestEvent.emit(joinRequest);

	return json({
		joinRequest,
		cancelsExisting: !!existingJoinRequest
	});
};
