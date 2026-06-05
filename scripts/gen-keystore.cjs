const forge = require('node-forge');
const fs = require('fs');

// Generate a 2048-bit RSA key pair
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 27); // ~10000 days

const attrs = [
  { name: 'commonName', value: 'Recetas Burgos' },
  { name: 'organizationName', value: 'Cerveceria Burgos' },
  { name: 'countryName', value: 'ES' }
];
cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.setExtensions([
  { name: 'basicConstraints', cA: true },
  { name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true },
  { name: 'extKeyUsage', serverAuth: true, clientAuth: true, codeSigning: true, emailProtection: true, timeStamping: true },
  { name: 'nsCertType', client: true, server: true, email: true, objsign: true, sslCA: true, emailCA: true, objCA: true }
]);

cert.sign(keys.privateKey, forge.md.sha256.create());

// Export to PKCS#12
const p12 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, [cert], 'android', {
  algorithm: '3des',
  generateLocalKeyId: true,
  friendlyName: 'android'
});
const p12Der = forge.asn1.toDer(p12).getBytes();
const p12Buffer = Buffer.from(p12Der, 'binary');
fs.writeFileSync('android.keystore', p12Buffer);

// Compute SHA-256 fingerprint of the certificate
const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
const md = forge.md.sha256.create();
md.update(certDer, 'binary');
const fingerprint = md.digest().toHex().match(/.{2}/g).join(':');

console.log('Keystore generated: android.keystore');
console.log('SHA-256 fingerprint:', fingerprint);

// Create assetlinks.json
const assetlinks = [{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "io.github.mathiaspaulenko.cerveceriarecipes",
    "sha256_cert_fingerprints": [fingerprint]
  }
}];

fs.mkdirSync('public/.well-known', { recursive: true });
fs.writeFileSync('public/.well-known/assetlinks.json', JSON.stringify(assetlinks, null, 2));
console.log('assetlinks.json created: public/.well-known/assetlinks.json');
