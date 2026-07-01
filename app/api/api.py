from fastapi import APIRouter

from app.api import agency, auth, applicant, employer, hiring_manager, hr, platform, public, ui

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(employer.router, prefix="/employer", tags=["employer"])
api_router.include_router(agency.router, prefix="", tags=["agency"])
api_router.include_router(hr.router, prefix="/hr", tags=["hr"])
api_router.include_router(applicant.router, prefix="", tags=["applicant"])
api_router.include_router(hiring_manager.router, prefix="/interviews", tags=["hiring_manager"])
api_router.include_router(public.router, prefix="/api/public", tags=["public"])
api_router.include_router(platform.router, prefix="/platform", tags=["platform"])
api_router.include_router(ui.router, tags=["ui"])
