import 'server-only'; // optional safety

export async function getEmployeeTimezone(): Promise<string> {
  /* ----------------------------------------------------------
   * Re-use the SAME query you already run in getEmployeeById.
   * We only need the time_zone column.
   * ---------------------------------------------------------- */
 
 
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/employees/me`, {
      headers: { cookie: '' }, // forward cookies if you use SSR auth
      next: { tags: ['tz'] },  // cache 1 request per layout
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.time_zone || 'Asia/Singapore';
  } catch {
    return 'Asia/Singapore'; // ultimate fallback
  }
}