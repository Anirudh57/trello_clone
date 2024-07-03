import { OrganizationList } from "@clerk/nextjs"

const CreateOrgPage = () => {
  return (
    <OrganizationList 
        hidePersonal
        afterSelectOrganizationUrl="/organization/:id"
        afterCreateOrganizationUrl="/organization/:id"
    />
  )
}

export default CreateOrgPage