	import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
	import { cekatApiRequest } from '../../GenericFunctions';

	type HeaderWithFileUrl = {
		header_text: string;
		header_file_url: string;
	};

	type HeaderWithoutFileUrl = {
		header_text: string;
	};

	type Footer = {
		footer_text?: string;
	};

	export async function handleSendMessage(
		context: IExecuteFunctions,
		i: number,
	): Promise<INodeExecutionData> {
		const conversationId = context.getNodeParameter('conversationId', i) as string;
		const receiverPhoneNumber = context.getNodeParameter('receiverPhoneNumber', i) as string;
		const text = context.getNodeParameter('text', i) as string;

		const isInteractive = context.getNodeParameter('isInteractive', i, false) as boolean;

		let body: any = {
			conversation_id: conversationId,
			receiver: receiverPhoneNumber,
			message: text,
		};

		if (!isInteractive) {
			const fileUrl = context.getNodeParameter('fileUrl', i) as string;
			body.file_url = fileUrl;
		} else {
			const mediaType = context.getNodeParameter('mediaType', i) as string;

			// Ambil parameter header yang sesuai
			let header: HeaderWithFileUrl | HeaderWithoutFileUrl;
			if (mediaType === 'list') {
				header = context.getNodeParameter('headerWithoutFileUrl', i, {}) as HeaderWithoutFileUrl;
			} else {
				header = context.getNodeParameter('headerWithFileUrl', i, {}) as HeaderWithFileUrl;
			}

			const footer = context.getNodeParameter('footer', i, {}) as Footer;

			if (mediaType === 'cta_url') {
				const ctaButton = context.getNodeParameter('ctaButton', i, {}) as {
					display_text?: string;
					url?: string;
				};

				body = {
					...body,
					media_type: 'cta_url',
					header: {
						text: header.header_text,
						file_url: (header as HeaderWithFileUrl).header_file_url,
					},
					footer: footer.footer_text,
					action: {
						name: 'cta_url',
						parameters: {
							display_text: ctaButton.display_text,
							url: ctaButton.url,
						},
					},
				};
			}

if (mediaType === 'button') {
	const buttonInputMethod = context.getNodeParameter('buttonInputMethod', i, 'manual') as string;
	
	let buttonData: { button: { id: string; title: string }[] };
	
	if (buttonInputMethod === 'dynamic') {
	  const dynamicButtons = context.getNodeParameter('dynamicButtons', i) as { id: string; title: string }[];
	  buttonData = { button: dynamicButtons };
	} else {
	  buttonData = context.getNodeParameter('buttons', i) as { button: { id: string; title: string }[] };
	}
  
	body = {
	  ...body,
	  media_type: 'button',
	  header: {
		text: header.header_text,
		file_url: (header as HeaderWithFileUrl).header_file_url,
	  },
	  footer: footer.footer_text,
	  action: {
		buttons: buttonData.button.map((b) => ({
		  type: 'reply',
		  reply: {
			id: b.id,
			title: b.title,
		  },
		})),
	  },
	};
  }
  
  if (mediaType === 'list') {
	const listInputMethod = context.getNodeParameter('listInputMethod', i, 'manual') as string;
	
	let buttonText: string;
	let sections: any[];
	
	if (listInputMethod === 'dynamic') {
	  buttonText = context.getNodeParameter('dynamicButtonText', i) as string;
	  sections = context.getNodeParameter('dynamicSections', i) as any[];
	} else {
	  buttonText = context.getNodeParameter('buttonText', i) as string;
	  const sectionsInput = context.getNodeParameter('sections', i) as { section: any[] };
	  sections = sectionsInput.section.map((section) => ({
		title: section.title,
		rows: section.rows.row.map((r: any) => ({
		  id: r.id,
		  title: r.title,
		  description: r.description,
		})),
	  }));
	}
  
	body = {
	  ...body,
	  media_type: 'list',
	  header: {
		text: header.header_text,
	  },
	  footer: footer.footer_text,
	  action: {
		button: buttonText,
		sections,
	  },
	};
  }
		}

		const response = await cekatApiRequest.call(
			context,
			'POST',
			'/messages/whatsapp',
			body,
			{},
			'api',
		);

		return {
			json: response,
		};
	}
