export async function fetchMovieData(subdir) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTg3MWZkMTBmMGFjOGRhNjA4M2QyNGVmMmFlMTAwMiIsIm5iZiI6MTcyMDAyMDM0NC44NzYwNCwic3ViIjoiNjY4NTY3Zjc3NTQ5MjZkNGVkM2IyODg5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.z1iZCra5aPWSEudWDh-As2fXkqd6XN__ZXjYLIP_4iU'
    }
  };

  try {
    const response= await fetch(`https://api.themoviedb.org/3/${subdir}`, options);
    if(!response.ok) {
      throw new Error('Failed to Fetch Data!')
    }
    const movies = await response.json();
    return movies;
  } catch (err) {
    console.log(err);
  }
}