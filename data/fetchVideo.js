export async function fetchVideo(subdir) {
  const response = await fetch(`https://vidsrc.xyz/embed/${subdir}`);

  return response;
}