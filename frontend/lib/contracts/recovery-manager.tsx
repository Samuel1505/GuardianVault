// lib/contracts/recovery-manager.ts

export const RECOVERY_MANAGER_ADDRESS: `0x${string}` = (() => {
  const address = process.env.NEXT_PUBLIC_RECOVERY_MANAGER_ADDRESS;
  if (address?.startsWith('0x')) {
    return address as `0x${string}`;
  }
  throw new Error("Invalid or missing NEXT_PUBLIC_RECOVERY_MANAGER_ADDRESS environment variable");
})();

export const RECOVERY_MANAGER_ABI = [
  {
    type: "function",
    name: "setup_guardians",
    inputs: [
      { name: "guardian_merkle_root", type: "core::felt252" },
      { name: "threshold", type: "core::integer::u32" }
    ],
    outputs: [],
    state_mutability: "external"
  },
  {
    type: "function",
    name: "initiate_recovery",
    inputs: [
      { name: "old_wallet", type: "core::starknet::contract_address::ContractAddress" },
      { name: "new_wallet", type: "core::starknet::contract_address::ContractAddress" }
    ],
    outputs: [],
    state_mutability: "external"
  },
  {
    type: "function",
    name: "approve_recovery",
    inputs: [
      { name: "old_wallet", type: "core::starknet::contract_address::ContractAddress" },
      { name: "guardian_address", type: "core::starknet::contract_address::ContractAddress" },
      { name: "signature_r", type: "core::felt252" },
      { name: "signature_s", type: "core::felt252" },
      { name: "merkle_proof", type: "core::array::Array::<core::felt252>" }
    ],
    outputs: [],
    state_mutability: "external"
  },
  {
    type: "function",
    name: "finalize_recovery",
    inputs: [
      { name: "old_wallet", type: "core::starknet::contract_address::ContractAddress" }
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "external"
  },
  {
    type: "function",
    name: "get_recovery_request",
    inputs: [
      { name: "old_wallet", type: "core::starknet::contract_address::ContractAddress" }
    ],
    outputs: [
      { type: "recovery_manager::recovery_manager::RecoveryRequest" }
    ],
    state_mutability: "view"
  },
  {
    type: "function",
    name: "get_approval_count",
    inputs: [
      { name: "old_wallet", type: "core::starknet::contract_address::ContractAddress" }
    ],
    outputs: [{ type: "core::integer::u32" }],
    state_mutability: "view"
  },
  {
    type: "function",
    name: "is_recovery_approved",
    inputs: [
      { name: "old_wallet", type: "core::starknet::contract_address::ContractAddress" }
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "view"
  }
] as const;