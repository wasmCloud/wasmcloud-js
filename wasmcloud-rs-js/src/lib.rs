use wasm_bindgen::prelude::*;
use js_sys::{Uint8Array};

use wascap::wasm::{extract_claims};
use wascap::jwt::{validate_token, Actor};

use nkeys::KeyPair;

// HostKey holds pk and seed for server key
#[wasm_bindgen]
pub struct HostKey {
    pk: String,
    seed: String,
}

// HostKey nkeys implementation
#[wasm_bindgen]
impl HostKey {
    #[wasm_bindgen(constructor)]
    // new creates a new nkeys server key
    pub fn new() -> HostKey {
        let kp = KeyPair::new_server();
        let seed = kp.seed().unwrap();
        HostKey {
            pk: kp.public_key(),
            seed: seed,
        }
    }

    // pk returns the HostKey pk
    #[wasm_bindgen(getter)]
    pub fn pk(&self) -> String {
        return String::from(&self.pk);
    }

    // seed returns the HostKey seed
    #[wasm_bindgen(getter)]
    pub fn seed(&self) -> String {
        return String::from(&self.seed);
    }
}

// extract_jwt extracts the jwt token from a wasm module as js_sys::Uint8Array
#[wasm_bindgen]
pub fn extract_jwt(contents: &Uint8Array) -> Result<String, JsValue> {
    let claims = extract_claims(contents.to_vec());
    let out = match claims {
        Ok(token) => Ok(String::from(token.unwrap().jwt)),
        Err(err) => Err(JsValue::from_str(&format!("{}", err))),
    };
    return out;
}

// validate_jwt validates the jwt token
#[wasm_bindgen]
pub fn validate_jwt(jwt: &str) -> bool {
    let validate = validate_token::<Actor>(jwt);
    let token = validate.unwrap();
    if token.cannot_use_yet || token.expired {
        return false;
    }
    return true;
}

