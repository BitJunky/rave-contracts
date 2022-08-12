
 const {expect} =require("chai");
 const {ethers} =require("hardhat");
 
 /* Just tests to make sure the rave instance works */
 describe("Rave - Basic ERC721 read functionctions.", function () {
   it(`Should ${"return"} FNS ${"as"} the symbol`, async function () {
     const Rave =await ethers.getContractFactory("FantomsArtNameSystem");
     const rave =await Rave.deploy();
    await rave.deployed();
 
     //console.log(await agUSD.owner());
 
 expect(await rave.symbol()).to.equal("FNS");
   });
 });
 
 
 describe("externalRegistry - Multiple", function () {
   it("setText - fantoms.art", async function () {
     const Strings =await ethers.getContractFactory("StringUtils"); const strings =await Strings.deploy();await strings.deployed();
     const Rave =await ethers.getContractFactory("FantomsArtNameSystem");
     const ExternalRegistry =await ethers.getContractFactory("externalRegistry", {
       libraries: {
         StringUtils: strings.address,
       },
     });
     const rave =await Rave.deploy();
     const externalRegistry =await ExternalRegistry.deploy(rave.address);
    await rave.deployed();
    await externalRegistry.deployed();
 
    await rave.changeFee(0);
 
    await rave.registerName("z.ftm");
 
    await externalRegistry.setText("Z.FTM", "website", "https://fantoms.art/")
 
     const test =await externalRegistry.getText("Z.FTM", "website");
 
     expect(test).to.equal("https://fantoms.art/")
   });
 
   it("setText - larger value", async function () {
     const Strings =await ethers.getContractFactory("StringUtils"); const strings =await Strings.deploy();await strings.deployed();
     const Rave =await ethers.getContractFactory("FantomsArtNameSystem");
     const ExternalRegistry =await ethers.getContractFactory("externalRegistry", {
       libraries: {
         StringUtils: strings.address,
       },
     });
     const rave =await Rave.deploy();
     const externalRegistry =await ExternalRegistry.deploy(rave.address);
    await rave.deployed();
    await externalRegistry.deployed();
 
    await rave.changeFee(0);
 
    await rave.registerName("z.ftm");
 
     const toSet = ((Math.random()*10**24)**2).toString();
 
    await externalRegistry.setText("Z.FTM", "random", toSet)
 
     const test =await externalRegistry.getText("Z.FTM", "random");
 
     expect(test).to.equal(toSet)
   });
 
   it("setText - dont allow unknown names", async function () {
     const Strings =await ethers.getContractFactory("StringUtils"); const strings =await Strings.deploy();await strings.deployed();
     const Rave =await ethers.getContractFactory("FantomsArtNameSystem");
     const ExternalRegistry =await ethers.getContractFactory("externalRegistry", {
       libraries: {
         StringUtils: strings.address,
       },
     });
     const rave =await Rave.deploy();
     const externalRegistry =await ExternalRegistry.deploy(rave.address);
    await rave.deployed();
    await externalRegistry.deployed();
 
    await rave.changeFee(0);
 
    await rave.registerName("z.ftm");
 
    await expect(externalRegistry.setText("z.ftm", "website", "https://fantoms.art/")).to.be.revertedWith("RaveErrors (404): Name not found [try querying in all-capitals]")
   });
 
   it("setText - dont allow name that you dont own", async function () {
     const Strings =await ethers.getContractFactory("StringUtils"); const strings =await Strings.deploy();await strings.deployed();
     const Rave =await ethers.getContractFactory("FantomsArtNameSystem");
     const ExternalRegistry =await ethers.getContractFactory("externalRegistry", {
       libraries: {
         StringUtils: strings.address,
       },
     });
     const rave =await Rave.deploy();
     const externalRegistry =await ExternalRegistry.deploy(rave.address);
    await rave.deployed();
    await externalRegistry.deployed();
 
    await rave.changeFee(0);
 
    await rave.registerName("f.ftm");
    await rave.transferName(await rave.getOwnerOfName("F.FTM"), "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", "F.FTM")
 
     const toSet = ((Math.random()*10**24)**2).toString();
 
    await expect(externalRegistry.setText("F.FTM", "random", toSet)).to.be.revertedWith("RaveErrors (401): Not authorised to perform this action.")
   });
 });
 