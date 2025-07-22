use dep::keccak256;

fn main(guess_hash: Field, answer_hash: pub Field, address: pub Field) {
    let guess_hash_decomposed: [u8; 32] = guess_hash.to_be_bytes();

    let guess_double_hash_decomposed: [u8; 32] = keccak256::keccak256(guess_hash_decomposed, 32);

    assert(Field::from_be_bytes(guess_double_hash_decomposed) == answer_hash, "Incorrect guess");
}
