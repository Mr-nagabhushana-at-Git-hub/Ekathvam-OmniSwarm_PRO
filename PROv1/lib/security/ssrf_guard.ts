// lib/security/ssrf_guard.ts
import dns from 'node:dns/promises';
import net from 'node:net';

const PRIVATE_RANGES = ['127.0.0.0/8', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '169.254.0.0/16'];

export async function safeFetch(urlStr: string) {
  const url = new URL(urlStr);
  const { address } = await dns.lookup(url.hostname);
  
  if (isPrivateIP(address)) {
    throw new Error("SSRF Attempt Blocked: Private IP detected.");
  }

  // Fetch using the IP to prevent TOCTOU/Rebinding
  return fetch(`http://${address}${url.pathname}`, {
    headers: { 'Host': url.hostname } 
  });
}
