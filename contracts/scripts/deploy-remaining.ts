import { network } from "hardhat";

const { ethers } = await network.create();

// Already deployed on Base mainnet
const EXISTING = {
  REKT_TOKEN: "0x8456CaC7C890CC2f4D35ca69A62D3bD1Df2a7580",
  AGENT_NFT: "0xdE5F6D612D7bD9b3CD860aA811015E89b4f837bF",
  AGENT_REGISTRY: "0xbAf17a713dD0f51301b1164e5899e9C519A2d0df",
  AGENT_STAKING: "0xcD38Cc5Ed301fd6Fbc40922B13fE5954215337F2",
  REWARD_DISTRIBUTOR: "0x4637B28Bd56Cb99AE529cd62Cc7cE29517a27B2c",
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddr = await deployer.getAddress();
  console.log("Deploying with:", deployerAddr);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployerAddr)), "ETH");

  const tokenAddr = EXISTING.REKT_TOKEN;

  // 6. ReputationOracle
  const oracle = await ethers.deployContract("ReputationOracle", [deployerAddr]);
  const oracleAddr = await oracle.getAddress();
  console.log("6/9 ReputationOracle:", oracleAddr);

  // 7. TaskMarketplace
  const marketplace = await ethers.deployContract("TaskMarketplace", [tokenAddr, deployerAddr, deployerAddr]);
  const marketplaceAddr = await marketplace.getAddress();
  console.log("7/9 TaskMarketplace:", marketplaceAddr);

  // 8. AgentEscrow
  const escrow = await ethers.deployContract("AgentEscrow", [tokenAddr, deployerAddr]);
  const escrowAddr = await escrow.getAddress();
  console.log("8/9 AgentEscrow:", escrowAddr);

  // 9. AgentGovernance
  const governance = await ethers.deployContract("AgentGovernance", [
    deployerAddr,
    EXISTING.AGENT_STAKING,
    40320,  // ~1 week on Base (2s blocks)
    10,     // 10% quorum
    ethers.parseEther("1000"), // 1000 REKT to propose
  ]);
  const governanceAddr = await governance.getAddress();
  console.log("9/9 AgentGovernance:", governanceAddr);

  // Link RewardDistributor -> AgentNFT (using raw tx to avoid encoding issue)
  console.log("\nLinking contracts...");
  const setAgentNFTData = ethers.id("setAgentNFT(address)").slice(0, 10) +
    ethers.AbiCoder.defaultAbiCoder().encode(["address"], [EXISTING.AGENT_NFT]).slice(2);
  const linkTx = await deployer.sendTransaction({
    to: EXISTING.REWARD_DISTRIBUTOR,
    data: setAgentNFTData,
  });
  await linkTx.wait();
  console.log("  Linked RewardDistributor -> AgentNFT");

  // Fund reward pool (100M REKT)
  console.log("\nFunding reward pool...");
  const tokenAbi = ["function approve(address,uint256) returns (bool)", "function balanceOf(address) view returns (uint256)"];
  const token = new ethers.Contract(tokenAddr, tokenAbi, deployer);
  const distributorAbi = ["function fundPool(uint256)"];
  const distributor = new ethers.Contract(EXISTING.REWARD_DISTRIBUTOR, distributorAbi, deployer);

  const fundAmount = ethers.parseEther("100000000");
  const deployerBal = await token.balanceOf(deployerAddr);
  console.log("  Deployer REKT balance:", ethers.formatEther(deployerBal));

  if (deployerBal >= fundAmount) {
    const approveTx = await token.approve(EXISTING.REWARD_DISTRIBUTOR, fundAmount);
    await approveTx.wait();
    console.log("  Approved 100M REKT");

    const fundTx = await distributor.fundPool(fundAmount);
    await fundTx.wait();
    console.log("  Funded reward pool: 100M REKT");
  } else {
    console.log("  SKIPPED: Not enough REKT to fund pool (need 100M)");
  }

  console.log("\n========== DEPLOYMENT COMPLETE ==========");
  console.log(`Network: Base (chain ${(await ethers.provider.getNetwork()).chainId})`);
  console.log(`Deployer: ${deployerAddr}`);

  console.log("\n========== ADD TO .env.local ==========");
  console.log(`NEXT_PUBLIC_REKT_TOKEN_ADDRESS=${tokenAddr}`);
  console.log(`NEXT_PUBLIC_AGENT_NFT_ADDRESS=${EXISTING.AGENT_NFT}`);
  console.log(`NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=${EXISTING.AGENT_REGISTRY}`);
  console.log(`NEXT_PUBLIC_AGENT_STAKING_ADDRESS=${EXISTING.AGENT_STAKING}`);
  console.log(`NEXT_PUBLIC_REWARD_DISTRIBUTOR_ADDRESS=${EXISTING.REWARD_DISTRIBUTOR}`);
  console.log(`NEXT_PUBLIC_REPUTATION_ORACLE_ADDRESS=${oracleAddr}`);
  console.log(`NEXT_PUBLIC_TASK_MARKETPLACE_ADDRESS=${marketplaceAddr}`);
  console.log(`NEXT_PUBLIC_AGENT_ESCROW_ADDRESS=${escrowAddr}`);
  console.log(`NEXT_PUBLIC_AGENT_GOVERNANCE_ADDRESS=${governanceAddr}`);
  console.log("========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
