import supabase from '../supabaseClient';

// Function to fetch border coordinates
export const fetchBorderData = async (positionId) => {
  try {
    // Fetch the border data from Supabase
    const { data, error } = await supabase
      .from('Exploitation')
      .select('Border (PointsLoc)')
      .eq('Position_ID', positionId)
      .single();

    if (error || !data?.Border?.PointsLoc) {
      console.error('Error fetching border data:', error);
      return [];
    }

    // Extract the points from the JSON data
    const points = data.Border.PointsLoc.points.map(point => ({
      latitude: point.lat,
      longitude: point.lon,
    }));

    return points;
  } catch (error) {
    console.error('Error fetching border data:', error);
    return [];
  }
};
