export async function lookupUser(id: number) {
    let postResult = await $.post('/profile/' + id).promise();
    if (postResult.success) return postResult;
    else throw new Error(postResult.error);
}