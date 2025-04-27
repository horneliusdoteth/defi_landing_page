import AWS from 'aws-sdk';
const ses = new AWS.SES({ region: 'us-east-1' });

export const handler = async (event) => {
    const data = JSON.parse(event.body);
    const params = {
        Destination: { ToAddresses: ['you@yourdomain.com'] },
        Message: {
            Body: {
                Text: {
                    Data: Object.entries(data)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join('\n'),
                },
            },
            Subject: { Data: 'New Drippy Finance Consultation Request' },
        },
        Source: 'no-reply@yourdomain.com',
    };

    await ses.sendEmail(params).promise();

    return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Sent' }),
    };
};
