export async function fetchVideo(subdir) {
  const response = await fetch(`https://vidsrc.to/embed/${subdir}`);

  return response;
}