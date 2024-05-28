export default function timeStampToDate( { seconds, nanoseconds}: {seconds: number, nanoseconds: number}): Date {
  // Convert the timestamp to milliseconds
  const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1_000_000);

  // Create a Date object
  const date = new Date(milliseconds);

  return date;
}

