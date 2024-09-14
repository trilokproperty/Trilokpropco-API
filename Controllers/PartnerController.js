import { PartnerModel } from "../Models/PartnerModel.js";
// add Partner controller:
export const addPartner = async(req, res) =>{
  try{
    const partner = new PartnerModel(req.body)
    const savedPartner = await partner.save();
    res.status(200).json(savedPartner)
  }
  catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}
// get Partners controller:
export const getPartners = async (req, res) =>{
    try{
      const partners = await PartnerModel.find();
      res.status(200).json(partners)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// Delete Partner Controller
export const deletePartner = async (req, res) => {
    const { id } = req.params;
    try {
        const partner = await PartnerModel.findById(id);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }
        // Delete partner from database
        await PartnerModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting partner', error });
    }
};