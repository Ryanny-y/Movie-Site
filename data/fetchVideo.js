export async function fetchVideo(subdir) {
  try {
    const response = await fetch(`https://vidsrc.xyz/embed/${subdir}`);
    return response;
  } catch (error) {
    console.log(err);
  }

}