export async function fetchMovieData(subdir) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTg3MWZkMTBmMGFjOGRhNjA4M2QyNGVmMmFlMTAwMiIsIm5iZiI6MTcyMDAyMDM0NC44NzYwNCwic3ViIjoiNjY4NTY3Zjc3NTQ5MjZkNGVkM2IyODg5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.z1iZCra5aPWSEudWDh-As2fXkqd6XN__ZXjYLIP_4iU'
    }
  };

  const response= await fetch(`https://api.themoviedb.org/3/${subdir}`, options);
  const movies = await response.json();
  return movies;
}